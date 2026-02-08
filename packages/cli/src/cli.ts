import { Command } from "commander";
import { VERSION } from "./constants.js";
import { createInitCommand } from "./commands/init.js";
import { createDoctorCommand } from "./commands/doctor.js";
import { createPrintClaudeMdCommand } from "./commands/print-claude-md.js";
import { createAddSkillCommand } from "./commands/add-skill.js";

export function createProgram(): Command {
  const program = new Command();

  program
    .name("claude-workstation")
    .description("Dotfiles for Claude — scaffold Claude workspaces into any project")
    .version(VERSION);

  program.addCommand(createInitCommand());
  program.addCommand(createDoctorCommand());
  program.addCommand(createPrintClaudeMdCommand());
  program.addCommand(createAddSkillCommand());

  return program;
}
