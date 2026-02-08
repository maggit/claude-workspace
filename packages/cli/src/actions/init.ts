import path from "node:path";
import ora from "ora";
import { log } from "../utils/logger.js";
import { fileExists } from "../utils/fs.js";
import { CLAUDE_MD_FILE, CLAUDE_EXAMPLE_FILE } from "../constants.js";
import { runInitPrompts } from "../services/prompts.js";
import { loadProfile } from "../services/profiles.js";
import { scaffoldClaudeDir } from "../services/scaffold-claude-dir.js";
import { scaffoldVault } from "../services/scaffold-vault.js";
import { generateClaudeMdContent, writeClaudeExampleMd } from "../services/claude-md.js";
import { createConfig, writeConfig } from "../services/config.js";
import { readActiveProfile, writeActiveProfile } from "../services/active-profile.js";
import type { InitOptions } from "../types.js";

export async function initAction(opts: InitOptions): Promise<void> {
  const targetDir = path.resolve(opts.dir);

  if (opts.dryRun) {
    log.info("Dry run mode — no changes will be made.\n");
  }

  // 1. Interactive prompts (skipped with --yes)
  const answers = await runInitPrompts(opts);
  const profileName = answers.profile;
  const vaultName = answers.vault;

  // 2. Load profile
  const spinner = ora("Loading profile...").start();
  let profile;
  try {
    profile = await loadProfile(profileName);
    spinner.succeed(`Profile: ${profile.name} — ${profile.description}`);
  } catch (err) {
    spinner.fail("Failed to load profile");
    log.error((err as Error).message);
    process.exit(1);
  }

  // 3. Read existing active profile for idempotency
  const existingActive = await readActiveProfile(targetDir);

  // 4. Scaffold .claude/ directories and copy files
  log.step("Scaffolding .claude/ directory...");
  const { managedFiles } = await scaffoldClaudeDir(targetDir, profile, {
    force: opts.force,
    dryRun: opts.dryRun,
  }, existingActive);

  // 5. Scaffold vault
  log.step(`Scaffolding vault: ${vaultName}/...`);
  await scaffoldVault(targetDir, vaultName, { dryRun: opts.dryRun });

  // 6. Generate and write CLAUDE.example.md (never touches CLAUDE.md)
  log.step(`Generating ${CLAUDE_EXAMPLE_FILE}...`);
  const claudeMdContent = await generateClaudeMdContent(profile, vaultName);
  await writeClaudeExampleMd(targetDir, claudeMdContent, {
    dryRun: opts.dryRun,
  });

  // 7. Write config
  const config = createConfig(profileName, vaultName);
  await writeConfig(targetDir, config, { dryRun: opts.dryRun });

  // 8. Write active profile
  await writeActiveProfile(targetDir, profileName, managedFiles, {
    dryRun: opts.dryRun,
  });

  // Done
  console.log("");
  log.success(`Workspace initialized with profile "${profileName}"!`);
  log.info(`  Vault: ${vaultName}/`);
  log.info(`  Skills: ${profile.skills.length} installed`);
  log.info(`  Templates: ${profile.templates.length} installed`);

  // Guide user on CLAUDE.md setup
  const hasClaudeMd = await fileExists(path.join(targetDir, CLAUDE_MD_FILE));
  console.log("");
  if (hasClaudeMd) {
    log.info(`  ${CLAUDE_EXAMPLE_FILE} has been written.`);
    log.info(`  You already have a ${CLAUDE_MD_FILE} — merge the example content into it as needed.`);
  } else {
    log.info(`  ${CLAUDE_EXAMPLE_FILE} has been written.`);
    log.info(`  Rename it to ${CLAUDE_MD_FILE} to activate: mv ${CLAUDE_EXAMPLE_FILE} ${CLAUDE_MD_FILE}`);
  }

  console.log("");
  log.info("Run 'cws doctor' to verify your workspace.");
}
