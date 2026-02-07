import path from "node:path";
import fs from "fs-extra";
import {
  CLAUDE_EXAMPLE_FILE,
  VAULT_FOLDERS,
} from "../constants.js";
import { getClaudeMdTemplatesDir } from "../utils/paths.js";
import { safeWriteFile } from "../utils/fs.js";
import { log } from "../utils/logger.js";
import type { Profile } from "../types.js";

/**
 * Generate CLAUDE.md content from a profile template.
 */
export async function generateClaudeMdContent(
  profile: Profile,
  vaultName: string,
): Promise<string> {
  const templateDir = getClaudeMdTemplatesDir();
  const templatePath = path.join(templateDir, profile.claudeMdTemplate);
  const template = await fs.readFile(templatePath, "utf-8");

  const folderList = VAULT_FOLDERS.map(
    (f) => `- \`${vaultName}/${f}/\``,
  ).join("\n");

  const skillInstructions = profile.skills.length > 0
    ? `Available skills:\n${profile.skills.map((s) => `- \`${s}\` — see \`.claude/skills/${s}\` for usage`).join("\n")}`
    : "No skills installed for this profile.";

  const namingConvention = [
    "- Use lowercase with hyphens: `my-feature-spec.md`",
    "- Prefix with date when chronology matters: `2026-02-07-auth-decision.md`",
    "- Keep filenames descriptive and specific",
    "- One topic per file",
  ].join("\n");

  const content = template
    .replace(/\{\{vaultPath\}\}/g, vaultName)
    .replace(/\{\{folderList\}\}/g, folderList)
    .replace(/\{\{skillInstructions\}\}/g, skillInstructions)
    .replace(/\{\{namingConvention\}\}/g, namingConvention);

  return content;
}

/**
 * Write CLAUDE.example.md into the target directory.
 *
 * Always writes to CLAUDE.example.md so we never overwrite an existing
 * user CLAUDE.md. The user can rename or merge it themselves.
 */
export async function writeClaudeExampleMd(
  targetDir: string,
  content: string,
  options: { dryRun: boolean },
): Promise<void> {
  const examplePath = path.join(targetDir, CLAUDE_EXAMPLE_FILE);

  if (options.dryRun) {
    log.dryRun(`Would write ${CLAUDE_EXAMPLE_FILE}`);
    return;
  }

  await safeWriteFile(examplePath, content);
  log.success(`Wrote ${CLAUDE_EXAMPLE_FILE}`);
}
