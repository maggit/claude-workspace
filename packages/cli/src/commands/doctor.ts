import { Command } from "commander";
import { doctorAction } from "../actions/doctor.js";

export function createDoctorCommand(): Command {
  return new Command("doctor")
    .description("Validate Claude workspace configuration and files")
    .option("-d, --dir <path>", "Target directory", process.cwd())
    .action(async (opts) => {
      await doctorAction({ dir: opts.dir });
    });
}
