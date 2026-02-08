import path from "node:path";
import { fileExists } from "../utils/fs.js";
import { log } from "../utils/logger.js";
import { readConfig } from "../services/config.js";
import { readActiveProfile } from "../services/active-profile.js";
import { loadProfile } from "../services/profiles.js";
import {
  CLAUDE_DIR,
  CLAUDE_EXAMPLE_FILE,
  CLAUDE_MD_FILE,
  VAULT_FOLDERS,
} from "../constants.js";
import type { DoctorCheck } from "../types.js";

export async function doctorAction(opts: { dir: string }): Promise<void> {
  const targetDir = path.resolve(opts.dir);
  const checks: DoctorCheck[] = [];

  log.info(`Checking workspace: ${targetDir}\n`);

  // 1. .claude/ directory exists
  const claudeDir = path.join(targetDir, CLAUDE_DIR);
  const claudeDirExists = await fileExists(claudeDir);
  checks.push({
    name: ".claude/ directory",
    passed: claudeDirExists,
    message: claudeDirExists
      ? ".claude/ directory exists"
      : ".claude/ directory not found",
    fix: "Run 'cws init' to create the workspace",
  });

  // 2. config.json valid
  const config = await readConfig(targetDir);
  checks.push({
    name: "config.json",
    passed: config !== null,
    message: config
      ? `config.json valid (profile: ${config.profile})`
      : "config.json missing or invalid",
    fix: "Run 'cws init' to regenerate config",
  });

  // 3. active.json exists
  const active = await readActiveProfile(targetDir);
  checks.push({
    name: "active.json",
    passed: active !== null,
    message: active
      ? `active.json present (profile: ${active.profile})`
      : "active.json missing",
    fix: "Run 'cws init' to regenerate active profile",
  });

  // 4. Check skill and template files
  if (config && active) {
    try {
      const profile = await loadProfile(config.profile);

      // Check skills (each skill is a <name>/SKILL.md directory)
      let allSkillsPresent = true;
      for (const skill of profile.skills) {
        const skillPath = path.join(claudeDir, "skills", skill, "SKILL.md");
        if (!(await fileExists(skillPath))) {
          allSkillsPresent = false;
          checks.push({
            name: `skill: ${skill}`,
            passed: false,
            message: `Missing skill: .claude/skills/${skill}/SKILL.md`,
            fix: `Run 'cws init --force' to restore missing files`,
          });
        }
      }
      if (allSkillsPresent) {
        checks.push({
          name: "skill files",
          passed: true,
          message: `All ${profile.skills.length} skills present`,
        });
      }

      // Check templates
      let allTemplatesPresent = true;
      for (const tmpl of profile.templates) {
        const tmplPath = path.join(claudeDir, "templates", tmpl);
        if (!(await fileExists(tmplPath))) {
          allTemplatesPresent = false;
          checks.push({
            name: `template: ${tmpl}`,
            passed: false,
            message: `Missing template file: .claude/templates/${tmpl}`,
            fix: `Run 'cws init --force' to restore missing files`,
          });
        }
      }
      if (allTemplatesPresent) {
        checks.push({
          name: "template files",
          passed: true,
          message: `All ${profile.templates.length} template files present`,
        });
      }
    } catch {
      checks.push({
        name: "profile validation",
        passed: false,
        message: `Could not load profile "${config.profile}"`,
        fix: "Check config.json profile name is valid",
      });
    }
  }

  // 5. Vault directory and subfolders
  if (config) {
    const vaultDir = path.join(targetDir, config.vaultPath);
    const vaultExists = await fileExists(vaultDir);
    checks.push({
      name: "vault directory",
      passed: vaultExists,
      message: vaultExists
        ? `Vault directory exists: ${config.vaultPath}/`
        : `Vault directory missing: ${config.vaultPath}/`,
      fix: "Run 'cws init' to create vault",
    });

    if (vaultExists) {
      let allFoldersPresent = true;
      for (const folder of VAULT_FOLDERS) {
        const folderPath = path.join(vaultDir, folder);
        if (!(await fileExists(folderPath))) {
          allFoldersPresent = false;
          checks.push({
            name: `vault: ${folder}`,
            passed: false,
            message: `Missing vault folder: ${config.vaultPath}/${folder}/`,
            fix: "Run 'cws init' to restore vault structure",
          });
        }
      }
      if (allFoldersPresent) {
        checks.push({
          name: "vault subfolders",
          passed: true,
          message: `All ${VAULT_FOLDERS.length} vault subfolders present`,
        });
      }
    }
  }

  // 6. CLAUDE.md setup check
  // Pass if CLAUDE.md exists (user has activated it).
  // Also pass if CLAUDE.example.md exists (workspace was initialized, user hasn't renamed yet).
  // Only fail if neither file exists.
  const examplePath = path.join(targetDir, CLAUDE_EXAMPLE_FILE);
  const claudeMdPath = path.join(targetDir, CLAUDE_MD_FILE);
  const exampleExists = await fileExists(examplePath);
  const claudeMdExists = await fileExists(claudeMdPath);

  if (claudeMdExists) {
    checks.push({
      name: CLAUDE_MD_FILE,
      passed: true,
      message: `${CLAUDE_MD_FILE} present`,
    });
  } else if (exampleExists) {
    checks.push({
      name: CLAUDE_MD_FILE,
      passed: true,
      message: `${CLAUDE_EXAMPLE_FILE} present — rename to ${CLAUDE_MD_FILE} to activate`,
      fix: `mv ${CLAUDE_EXAMPLE_FILE} ${CLAUDE_MD_FILE}`,
    });
  } else {
    checks.push({
      name: CLAUDE_MD_FILE,
      passed: false,
      message: `Neither ${CLAUDE_MD_FILE} nor ${CLAUDE_EXAMPLE_FILE} found`,
      fix: "Run 'cws init' to generate CLAUDE.example.md",
    });
  }

  // Print results
  console.log("");
  let failCount = 0;
  for (const check of checks) {
    if (check.passed) {
      log.pass(check.message);
    } else {
      log.fail(check.message);
      if (check.fix) {
        log.plain(`       ${check.fix}`);
      }
      failCount++;
    }
  }

  console.log("");
  if (failCount === 0) {
    log.success("All checks passed!");
  } else {
    log.warn(`${failCount} check(s) failed.`);
    process.exitCode = 1;
  }
}
