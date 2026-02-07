export const VERSION = "0.1.0";

export const CLAUDE_DIR = ".claude";
export const CLAUDE_EXAMPLE_FILE = "CLAUDE.example.md";
export const CLAUDE_MD_FILE = "CLAUDE.md";
export const CONFIG_FILE = "config.json";
export const ACTIVE_PROFILE_FILE = "active.json";

export const CLAUDE_SUBDIRS = [
  "skills",
  "templates",
  "snippets",
  "logs",
  "profiles",
] as const;

export const VAULT_FOLDERS = [
  "00_inbox",
  "01_specs",
  "02_architecture",
  "03_decisions",
  "04_knowledge",
  "05_prompts",
  "06_agents",
  "07_diagrams",
  "08_todos",
] as const;

export const DEFAULT_VAULT_NAME = "ContextDB";

export const DEFAULT_PROFILE = "default";

export const PROFILES = [
  "default",
  "engineering-exec",
  "indie-maker",
  "marketing",
] as const;
