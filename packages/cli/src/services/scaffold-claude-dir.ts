import path from "node:path";
import fs from "fs-extra";
import { CLAUDE_DIR, CLAUDE_SUBDIRS } from "../constants.js";
import { getSkillsDir, getTemplatesDir } from "../utils/paths.js";
import { fileExists, hashFile, hashString, backupFile, safeWriteFile } from "../utils/fs.js";
import { log } from "../utils/logger.js";
import type { Profile, ManagedFile, ActiveProfile } from "../types.js";

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
  const existingHashes = new Map<string, string>();
  if (existingActive) {
    for (const mf of existingActive.managedFiles) {
      existingHashes.set(mf.path, mf.hash);
    }
  }

  // Copy skill files
  const skillsSrcDir = getSkillsDir();
  for (const skillFile of profile.skills) {
    const srcPath = path.join(skillsSrcDir, skillFile);
    const destPath = path.join(claudeDir, "skills", skillFile);
    const relativePath = path.join(CLAUDE_DIR, "skills", skillFile);

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

async function copyManagedFile(
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
