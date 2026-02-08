export interface Profile {
  name: string;
  description: string;
  skills: string[];
  templates: string[];
  claudeMdTemplate: string;
}

export interface ClaudeConfig {
  version: string;
  profile: string;
  vaultPath: string;
  createdAt: string;
  updatedAt: string;
}

export interface ManagedFile {
  path: string;
  hash: string;
}

export interface ActiveProfile {
  profile: string;
  installedAt: string;
  managedFiles: ManagedFile[];
}

export interface InitOptions {
  dir: string;
  profile: string;
  vault: string;
  force: boolean;
  dryRun: boolean;
  yes: boolean;
}

export interface AddSkillOptions {
  dir: string;
  force: boolean;
  dryRun: boolean;
  list: boolean;
}

export interface DoctorCheck {
  name: string;
  passed: boolean;
  message: string;
  fix?: string;
}
