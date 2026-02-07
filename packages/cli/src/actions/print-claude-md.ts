import { loadProfile } from "../services/profiles.js";
import { generateClaudeMdContent } from "../services/claude-md.js";
import { log } from "../utils/logger.js";

export async function printClaudeMdAction(opts: {
  profile: string;
  vault: string;
}): Promise<void> {
  try {
    const profile = await loadProfile(opts.profile);
    const content = await generateClaudeMdContent(profile, opts.vault);
    process.stdout.write(content);
  } catch (err) {
    log.error((err as Error).message);
    process.exit(1);
  }
}
