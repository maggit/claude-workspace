import path from "node:path";
import fs from "fs-extra";
import { CLAUDE_DIR, CLAUDE_SUBDIRS } from "../constants.js";
import { getSkillsDir, getTemplatesDir } from "../utils/paths.js";
import { fileExists, hashFile, hashString, backupFile, safeWriteFile } from "../utils/fs.js";
import { log } from "../utils/logger.js";
import type { ManagedFile, ActiveProfile, Profile } from "../types.js";

export interface ScaffoldResult {
  managedFiles: ManagedFile[];
}

export async function scaffoldClaudeDir(
  targetDir: string,
  profile: Profile,
  options: { force: boolean; dryRun: boolean },
  existingActive: ActiveProfile | null,
): Promise<ScaffoldResult> {
  const claudeDir = path.join(targetDir, CLAUDE_DIR);
  const managedFiles: ManagedFile[] = [];

  // Create .claude/ subdirectories
  for (const subdir of CLAUDE_SUBDIRS) {
    const dir = path.join(claudeDir, subdir);
    if (options.dryRun) {
      if (!(await fileExists(dir))) {
        log.dryRun(`Would create directory: ${CLAUDE_DIR}/${subdir}/`);
      }
    } else {
      await fs.ensureDir(dir);
    }
  }

  // Build a map of existing managed file hashes for idempotency
  const existingHashes = buildExistingHashes(existingActive);

  // Copy skill directories (each skill is a <name>/SKILL.md)
  for (const skillName of profile.skills) {
    const result = await installSingleSkill(
      targetDir,
      skillName,
      existingHashes,
      options,
    );
    if (result) {
      managedFiles.push(result);
    }
  }

  // Copy template files
  const templatesSrcDir = getTemplatesDir();
  for (const templateFile of profile.templates) {
    const srcPath = path.join(templatesSrcDir, templateFile);
    const destPath = path.join(claudeDir, "templates", templateFile);
    const relativePath = path.join(CLAUDE_DIR, "templates", templateFile);

    const result = await copyManagedFile(
      srcPath,
      destPath,
      relativePath,
      existingHashes,
      options,
    );
    if (result) {
      managedFiles.push(result);
    }
  }

  return { managedFiles };
}

/**
 * Installs a single skill to .claude/skills/<name>/SKILL.md.
 * Reused by both `init` (via scaffoldClaudeDir) and `add-skill`.
 */
export async function installSingleSkill(
  targetDir: string,
  skillName: string,
  existingHashes: Map<string, string>,
  options: { force: boolean; dryRun: boolean },
): Promise<ManagedFile | null> {
  const claudeDir = path.join(targetDir, CLAUDE_DIR);
  const skillsSrcDir = getSkillsDir();
  const srcPath = path.join(skillsSrcDir, skillName, "SKILL.md");
  const destDir = path.join(claudeDir, "skills", skillName);
  const destPath = path.join(destDir, "SKILL.md");
  const relativePath = path.join(CLAUDE_DIR, "skills", skillName, "SKILL.md");

  if (options.dryRun) {
    if (!(await fileExists(destDir))) {
      log.dryRun(`Would create directory: ${CLAUDE_DIR}/skills/${skillName}/`);
    }
  } else {
    await fs.ensureDir(destDir);
  }

  return copyManagedFile(srcPath, destPath, relativePath, existingHashes, options);
}

/**
 * Build a hash map from an existing ActiveProfile for idempotency checks.
 */
export function buildExistingHashes(
  existingActive: ActiveProfile | null,
): Map<string, string> {
  const hashes = new Map<string, string>();
  if (existingActive) {
    for (const mf of existingActive.managedFiles) {
      hashes.set(mf.path, mf.hash);
    }
  }
  return hashes;
}

export async function copyManagedFile(
  srcPath: string,
  destPath: string,
  relativePath: string,
  existingHashes: Map<string, string>,
  options: { force: boolean; dryRun: boolean },
): Promise<ManagedFile | null> {
  const srcContent = await fs.readFile(srcPath, "utf-8");
  const srcHash = hashString(srcContent);

  if (await fileExists(destPath)) {
    const destHash = await hashFile(destPath);
    const previousHash = existingHashes.get(relativePath);

    // File unchanged from what we installed — skip
    if (destHash === srcHash) {
      return { path: relativePath, hash: srcHash };
    }

    // File exists but is NOT tracked in active.json — it's unmanaged
    if (!previousHash && !options.force) {
      log.warn(
        `Skipping ${relativePath} (already exists, not managed). ` +
        `Delete it and re-run to reinstall, or use --force to overwrite.`,
      );
      return null;
    }

    // File was modified by user (hash doesn't match what we installed)
    if (previousHash && destHash !== previousHash && !options.force) {
      log.warn(`Skipping ${relativePath} (modified by user). Use --force to overwrite.`);
      return { path: relativePath, hash: destHash };
    }

    // Overwrite with backup
    if (options.dryRun) {
      log.dryRun(`Would update: ${relativePath}`);
    } else {
      const backupPath = await backupFile(destPath);
      log.step(`Backed up ${relativePath} → ${path.basename(backupPath)}`);
      await safeWriteFile(destPath, srcContent);
      log.success(`Updated ${relativePath}`);
    }
  } else {
    if (options.dryRun) {
      log.dryRun(`Would create: ${relativePath}`);
    } else {
      await safeWriteFile(destPath, srcContent);
      log.success(`Created ${relativePath}`);
    }
  }

  return { path: relativePath, hash: srcHash };
}
