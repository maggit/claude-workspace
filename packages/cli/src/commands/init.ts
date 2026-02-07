import { Command } from "commander";
import { DEFAULT_PROFILE, DEFAULT_VAULT_NAME, PROFILES } from "../constants.js";
import { initAction } from "../actions/init.js";

export function createInitCommand(): Command {
  return new Command("init")
    .description("Scaffold a Claude workspace into a project directory")
    .option("-d, --dir <path>", "Target directory", process.cwd())
    .option(
      `-p, --profile <name>`,
      `Profile to use (${PROFILES.join(", ")})`,
      DEFAULT_PROFILE,
    )
    .option("--vault <name>", "Vault folder name", DEFAULT_VAULT_NAME)
    .option(
      "--force",
      "Overwrite user-modified managed files (with backup)",
      false,
    )
    .option("--dry-run", "Show what would be done without making changes", false)
    .option("-y, --yes", "Skip interactive prompts, use defaults", false)
    .action(async (opts) => {
      await initAction({
        dir: opts.dir,
        profile: opts.profile,
        vault: opts.vault,
        force: opts.force,
        dryRun: opts.dryRun,
        yes: opts.yes,
      });
    });
}
