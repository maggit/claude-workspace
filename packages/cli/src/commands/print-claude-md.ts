import { Command } from "commander";
import { printClaudeMdAction } from "../actions/print-claude-md.js";
import { DEFAULT_PROFILE, DEFAULT_VAULT_NAME, PROFILES } from "../constants.js";

export function createPrintClaudeMdCommand(): Command {
  return new Command("print-claude-md")
    .description("Print the generated CLAUDE.md content to stdout")
    .option(
      `-p, --profile <name>`,
      `Profile to use (${PROFILES.join(", ")})`,
      DEFAULT_PROFILE,
    )
    .option("--vault <name>", "Vault folder name", DEFAULT_VAULT_NAME)
    .action(async (opts) => {
      await printClaudeMdAction({
        profile: opts.profile,
        vault: opts.vault,
      });
    });
}
