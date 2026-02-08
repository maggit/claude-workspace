import { Command } from "commander";
import { addSkillAction } from "../actions/add-skill.js";

export function createAddSkillCommand(): Command {
  return new Command("add-skill")
    .description("Install a single skill into the workspace")
    .argument("[skill-name]", "Name of the skill to install")
    .option("-d, --dir <path>", "Target directory", process.cwd())
    .option(
      "--force",
      "Overwrite existing skill (with backup)",
      false,
    )
    .option("--dry-run", "Show what would be done without making changes", false)
    .option("-l, --list", "List all available skills", false)
    .action(async (skillName: string | undefined, opts) => {
      await addSkillAction(skillName, {
        dir: opts.dir,
        force: opts.force,
        dryRun: opts.dryRun,
        list: opts.list,
      });
    });
}
