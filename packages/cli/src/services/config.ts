import path from "node:path";
import { CLAUDE_DIR, CONFIG_FILE, VERSION } from "../constants.js";
import { safeWriteFile, safeReadFile } from "../utils/fs.js";
import { log } from "../utils/logger.js";
import type { ClaudeConfig } from "../types.js";

export function createConfig(profile: string, vaultPath: string): ClaudeConfig {
  const now = new Date().toISOString();
  return {
    version: VERSION,
    profile,
    vaultPath,
    createdAt: now,
    updatedAt: now,
  };
}

export async function writeConfig(
  targetDir: string,
  config: ClaudeConfig,
  options: { dryRun: boolean },
): Promise<void> {
  const configPath = path.join(targetDir, CLAUDE_DIR, CONFIG_FILE);

  if (options.dryRun) {
    log.dryRun(`Would write ${CLAUDE_DIR}/${CONFIG_FILE}`);
    return;
  }

  // Preserve createdAt if config already exists
  const existing = await readConfig(targetDir);
  if (existing) {
    config.createdAt = existing.createdAt;
  }

  await safeWriteFile(configPath, JSON.stringify(config, null, 2) + "\n");
  log.success(`Wrote ${CLAUDE_DIR}/${CONFIG_FILE}`);
}

export async function readConfig(
  targetDir: string,
): Promise<ClaudeConfig | null> {
  const configPath = path.join(targetDir, CLAUDE_DIR, CONFIG_FILE);
  const content = await safeReadFile(configPath);
  if (!content) return null;

  try {
    return JSON.parse(content) as ClaudeConfig;
  } catch {
    return null;
  }
}
