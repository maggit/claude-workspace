import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Returns the assets directory path.
 * In development (src/utils/), goes up two levels to packages/cli/assets.
 * In built (dist/), goes up one level to packages/cli/assets.
 */
export function getAssetsDir(): string {
  // From dist/bin.js → __dirname = .../packages/cli/dist → ../assets
  // From src/utils/paths.ts → __dirname = .../packages/cli/src/utils → ../../assets
  // Detect by checking if we're inside a "src" directory
  const inSrc = __dirname.includes(path.sep + "src");
  const cliRoot = inSrc
    ? path.resolve(__dirname, "..", "..")
    : path.resolve(__dirname, "..");
  const assetsDir = path.join(cliRoot, "assets");
  return assetsDir;
}

export function getSkillsDir(): string {
  return path.join(getAssetsDir(), "skills");
}

export function getTemplatesDir(): string {
  return path.join(getAssetsDir(), "templates");
}

export function getProfilesDir(): string {
  return path.join(getAssetsDir(), "profiles");
}

export function getClaudeMdTemplatesDir(): string {
  return path.join(getAssetsDir(), "claude-md");
}

export function getVaultTemplatesDir(): string {
  return path.join(getAssetsDir(), "vault");
}
