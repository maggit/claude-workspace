import path from "node:path";
import fs from "fs-extra";
import { log } from "../utils/logger.js";
import { CLAUDE_DIR } from "../constants.js";
import { listAvailableSkills, validateSkillName } from "../services/skills.js";
import { installSingleSkill, buildExistingHashes } from "../services/scaffold-claude-dir.js";
import { readActiveProfile, writeActiveProfile } from "../services/active-profile.js";
import type { AddSkillOptions } from "../types.js";

export async function addSkillAction(
  skillName: string | undefined,
  opts: AddSkillOptions,
): Promise<void> {
  // --list: show available skills and exit
  if (opts.list) {
    const skills = await listAvailableSkills();
    log.info(`Available skills (${skills.length}):\n`);
    const maxName = Math.max(...skills.map((s) => s.name.length));
    for (const skill of skills) {
      log.plain(`  ${skill.name.padEnd(maxName + 2)}${skill.description}`);
    }
    return;
  }

  if (!skillName) {
    log.error("Please specify a skill name. Use --list to see available skills.");
    process.exit(1);
  }

  const targetDir = path.resolve(opts.dir);

  if (opts.dryRun) {
    log.info("Dry run mode — no changes will be made.\n");
  }

  // Validate skill exists
  const isValid = await validateSkillName(skillName);
  if (!isValid) {
    log.error(
      `Unknown skill "${skillName}". Use --list to see available skills.`,
    );
    process.exit(1);
  }

  // Ensure .claude/skills/ and .claude/profiles/ exist
  const claudeDir = path.join(targetDir, CLAUDE_DIR);
  if (!opts.dryRun) {
    await fs.ensureDir(path.join(claudeDir, "skills"));
    await fs.ensureDir(path.join(claudeDir, "profiles"));
  }

  // Read existing active profile for idempotency
  const existingActive = await readActiveProfile(targetDir);
  const existingHashes = buildExistingHashes(existingActive);

  // Install the skill
  const result = await installSingleSkill(
    targetDir,
    skillName,
    existingHashes,
    { force: opts.force, dryRun: opts.dryRun },
  );

  if (!result) {
    // Skill was skipped (unmanaged or other reason)
    return;
  }

  // Merge into active.json
  if (!opts.dryRun) {
    const existingFiles = existingActive?.managedFiles ?? [];
    // Remove any previous entry for this path, then add the new one
    const merged = existingFiles.filter((mf) => mf.path !== result.path);
    merged.push(result);

    await writeActiveProfile(
      targetDir,
      existingActive?.profile ?? "custom",
      merged,
      { dryRun: false },
    );
  }

  console.log("");
  log.success(`Skill "${skillName}" installed!`);
}
