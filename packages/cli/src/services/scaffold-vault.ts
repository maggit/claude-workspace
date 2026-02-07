import path from "node:path";
import fs from "fs-extra";
import { VAULT_FOLDERS } from "../constants.js";
import { getVaultTemplatesDir } from "../utils/paths.js";
import { fileExists, safeWriteFile } from "../utils/fs.js";
import { log } from "../utils/logger.js";

export async function scaffoldVault(
  targetDir: string,
  vaultName: string,
  options: { dryRun: boolean },
): Promise<void> {
  const vaultDir = path.join(targetDir, vaultName);

  // Create vault root
  if (options.dryRun) {
    if (!(await fileExists(vaultDir))) {
      log.dryRun(`Would create vault: ${vaultName}/`);
    }
  } else {
    await fs.ensureDir(vaultDir);
  }

  // Create numbered subdirectories with .gitkeep
  for (const folder of VAULT_FOLDERS) {
    const folderPath = path.join(vaultDir, folder);
    const gitkeepPath = path.join(folderPath, ".gitkeep");

    if (options.dryRun) {
      if (!(await fileExists(folderPath))) {
        log.dryRun(`Would create: ${vaultName}/${folder}/`);
      }
    } else {
      await fs.ensureDir(folderPath);
      if (!(await fileExists(gitkeepPath))) {
        await safeWriteFile(gitkeepPath, "");
      }
    }
  }

  // Copy vault README
  const vaultTemplatesDir = getVaultTemplatesDir();
  const readmeSrc = path.join(vaultTemplatesDir, "README.md");
  const readmeDest = path.join(vaultDir, "README.md");

  if (!(await fileExists(readmeDest))) {
    if (options.dryRun) {
      log.dryRun(`Would create: ${vaultName}/README.md`);
    } else {
      const content = await fs.readFile(readmeSrc, "utf-8");
      await safeWriteFile(readmeDest, content);
      log.success(`Created ${vaultName}/README.md`);
    }
  }

  // Copy vault _index.md
  const indexSrc = path.join(vaultTemplatesDir, "_index.md");
  const indexDest = path.join(vaultDir, "_index.md");

  if (!(await fileExists(indexDest))) {
    if (options.dryRun) {
      log.dryRun(`Would create: ${vaultName}/_index.md`);
    } else {
      const content = await fs.readFile(indexSrc, "utf-8");
      await safeWriteFile(indexDest, content);
      log.success(`Created ${vaultName}/_index.md`);
    }
  }
}
