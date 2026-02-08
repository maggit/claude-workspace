import path from "node:path";
import fs from "fs-extra";
import { getSkillsDir } from "../utils/paths.js";

export interface SkillInfo {
  name: string;
  description: string;
}

/**
 * Parse YAML frontmatter from a SKILL.md file.
 * Extracts `name` and `description` fields.
 */
export function parseFrontmatter(content: string): { name: string; description: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return { name: "", description: "" };
  }

  const frontmatter = match[1];
  const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
  const descMatch = frontmatter.match(/^description:\s*"?(.+?)"?\s*$/m);

  return {
    name: nameMatch ? nameMatch[1].trim() : "",
    description: descMatch ? descMatch[1].trim() : "",
  };
}

/**
 * Returns the list of available skill directory names from assets/skills/.
 */
export async function getAvailableSkillNames(): Promise<string[]> {
  const skillsDir = getSkillsDir();
  const entries = await fs.readdir(skillsDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

/**
 * Returns true if the given skill name exists in assets/skills/.
 */
export async function validateSkillName(name: string): Promise<boolean> {
  const skillPath = path.join(getSkillsDir(), name, "SKILL.md");
  try {
    await fs.access(skillPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Lists all available skills with their names and descriptions.
 */
export async function listAvailableSkills(): Promise<SkillInfo[]> {
  const skillsDir = getSkillsDir();
  const names = await getAvailableSkillNames();
  const skills: SkillInfo[] = [];

  for (const name of names) {
    const content = await fs.readFile(
      path.join(skillsDir, name, "SKILL.md"),
      "utf-8",
    );
    const fm = parseFrontmatter(content);
    skills.push({
      name,
      description: fm.description || "(no description)",
    });
  }

  return skills;
}
