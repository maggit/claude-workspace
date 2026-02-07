import path from "node:path";
import fs from "fs-extra";
import { getProfilesDir } from "../utils/paths.js";
import type { Profile } from "../types.js";
import { PROFILES } from "../constants.js";

export async function loadProfile(name: string): Promise<Profile> {
  if (!PROFILES.includes(name as (typeof PROFILES)[number])) {
    throw new Error(
      `Unknown profile "${name}". Available profiles: ${PROFILES.join(", ")}`,
    );
  }

  const profilePath = path.join(getProfilesDir(), `${name}.json`);
  const content = await fs.readFile(profilePath, "utf-8");
  return JSON.parse(content) as Profile;
}

export async function listProfiles(): Promise<Profile[]> {
  const profiles: Profile[] = [];
  for (const name of PROFILES) {
    profiles.push(await loadProfile(name));
  }
  return profiles;
}
