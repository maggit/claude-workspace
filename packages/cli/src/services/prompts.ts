import prompts from "prompts";
import { DEFAULT_PROFILE, DEFAULT_VAULT_NAME, PROFILES } from "../constants.js";
import type { InitOptions } from "../types.js";

export interface PromptResult {
  profile: string;
  vault: string;
}

export async function runInitPrompts(
  opts: InitOptions,
): Promise<PromptResult> {
  if (opts.yes) {
    return {
      profile: opts.profile,
      vault: opts.vault,
    };
  }

  const response = await prompts(
    [
      {
        type: "select",
        name: "profile",
        message: "Which profile would you like to use?",
        choices: PROFILES.map((p) => ({ title: p, value: p })),
        initial: PROFILES.indexOf(
          opts.profile as (typeof PROFILES)[number],
        ),
      },
      {
        type: "text",
        name: "vault",
        message: "Vault folder name?",
        initial: opts.vault || DEFAULT_VAULT_NAME,
      },
    ],
    {
      onCancel: () => {
        process.exit(1);
      },
    },
  );

  return {
    profile: response.profile || DEFAULT_PROFILE,
    vault: response.vault || DEFAULT_VAULT_NAME,
  };
}
