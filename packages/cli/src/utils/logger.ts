import chalk from "chalk";

export const log = {
  info(msg: string): void {
    console.log(chalk.blue("ℹ"), msg);
  },

  success(msg: string): void {
    console.log(chalk.green("✔"), msg);
  },

  warn(msg: string): void {
    console.log(chalk.yellow("⚠"), msg);
  },

  error(msg: string): void {
    console.error(chalk.red("✖"), msg);
  },

  step(msg: string): void {
    console.log(chalk.cyan("→"), msg);
  },

  dryRun(msg: string): void {
    console.log(chalk.magenta("[dry-run]"), msg);
  },

  pass(msg: string): void {
    console.log(chalk.green("PASS"), msg);
  },

  fail(msg: string): void {
    console.log(chalk.red("FAIL"), msg);
  },

  plain(msg: string): void {
    console.log(msg);
  },
};
