import path from "node:path";
import { CLAUDE_DIR, ACTIVE_PROFILE_FILE } from "../constants.js";
import { safeWriteFile, safeReadFile } from "../utils/fs.js";
import { log } from "../utils/logger.js";
import type { ActiveProfile, ManagedFile } from "../types.js";

export async function writeActiveProfile(
  targetDir: string,
  profile: string,
  managedFiles: ManagedFile[],
  options: { dryRun: boolean },
): Promise<void> {
  const activePath = path.join(
    targetDir,
    CLAUDE_DIR,
    "profiles",
    ACTIVE_PROFILE_FILE,
  );

  const activeProfile: ActiveProfile = {
    profile,
    installedAt: new Date().toISOString(),
    managedFiles,
  };

  if (options.dryRun) {
    log.dryRun(
      `Would write ${CLAUDE_DIR}/profiles/${ACTIVE_PROFILE_FILE}`,
    );
    return;
  }

  await safeWriteFile(
    activePath,
    JSON.stringify(activeProfile, null, 2) + "\n",
  );
  log.success(`Wrote ${CLAUDE_DIR}/profiles/${ACTIVE_PROFILE_FILE}`);
}

export async function readActiveProfile(
  targetDir: string,
): Promise<ActiveProfile | null> {
  const activePath = path.join(
    targetDir,
    CLAUDE_DIR,
    "profiles",
    ACTIVE_PROFILE_FILE,
  );
  const content = await safeReadFile(activePath);
  if (!content) return null;

  try {
    return JSON.parse(content) as ActiveProfile;
  } catch {
    return null;
  }
}
