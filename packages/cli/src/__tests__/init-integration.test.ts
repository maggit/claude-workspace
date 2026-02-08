import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import fs from "fs-extra";
import os from "node:os";
import { initAction } from "../actions/init.js";
import { doctorAction } from "../actions/doctor.js";
import {
  CLAUDE_DIR,
  CLAUDE_EXAMPLE_FILE,
  CLAUDE_MD_FILE,
  CLAUDE_SUBDIRS,
  VAULT_FOLDERS,
} from "../constants.js";

function defaultOpts(dir: string) {
  return {
    dir,
    profile: "default",
    vault: "ContextDB",
    force: false,
    dryRun: false,
    yes: true,
  };
}

describe("init integration", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "claude-workstation-integ-"));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("creates full workspace structure", async () => {
    await initAction(defaultOpts(tmpDir));

    // .claude/ subdirs
    for (const subdir of CLAUDE_SUBDIRS) {
      expect(await fs.pathExists(path.join(tmpDir, CLAUDE_DIR, subdir))).toBe(
        true,
      );
    }

    // Vault folders
    for (const folder of VAULT_FOLDERS) {
      expect(
        await fs.pathExists(path.join(tmpDir, "ContextDB", folder)),
      ).toBe(true);
    }

    // CLAUDE.example.md (not CLAUDE.md)
    const exampleMd = await fs.readFile(
      path.join(tmpDir, CLAUDE_EXAMPLE_FILE),
      "utf-8",
    );
    expect(exampleMd).toContain("ContextDB");
    expect(exampleMd).toContain("skills");

    // CLAUDE.md should NOT exist
    expect(
      await fs.pathExists(path.join(tmpDir, CLAUDE_MD_FILE)),
    ).toBe(false);

    // Config
    const config = JSON.parse(
      await fs.readFile(
        path.join(tmpDir, CLAUDE_DIR, "config.json"),
        "utf-8",
      ),
    );
    expect(config.profile).toBe("default");
    expect(config.vaultPath).toBe("ContextDB");

    // Active profile
    const active = JSON.parse(
      await fs.readFile(
        path.join(tmpDir, CLAUDE_DIR, "profiles", "active.json"),
        "utf-8",
      ),
    );
    expect(active.profile).toBe("default");
    expect(active.managedFiles.length).toBeGreaterThan(0);
  });

  it("is idempotent — second run overwrites CLAUDE.example.md with same content", async () => {
    await initAction(defaultOpts(tmpDir));
    const first = await fs.readFile(
      path.join(tmpDir, CLAUDE_EXAMPLE_FILE),
      "utf-8",
    );

    await initAction(defaultOpts(tmpDir));
    const second = await fs.readFile(
      path.join(tmpDir, CLAUDE_EXAMPLE_FILE),
      "utf-8",
    );

    expect(second).toBe(first);
  });

  it("does not touch existing CLAUDE.md", async () => {
    // Pre-create a CLAUDE.md with user content
    const userContent = "# My Project\n\nThis is my custom CLAUDE.md content.\n";
    await fs.writeFile(path.join(tmpDir, CLAUDE_MD_FILE), userContent);

    await initAction(defaultOpts(tmpDir));

    // User CLAUDE.md should be untouched
    const result = await fs.readFile(
      path.join(tmpDir, CLAUDE_MD_FILE),
      "utf-8",
    );
    expect(result).toBe(userContent);

    // CLAUDE.example.md should exist separately
    expect(
      await fs.pathExists(path.join(tmpDir, CLAUDE_EXAMPLE_FILE)),
    ).toBe(true);
  });

  it("installs profile-specific skills only", async () => {
    await initAction({
      ...defaultOpts(tmpDir),
      profile: "marketing",
    });

    // marketing profile should have seo-brief
    expect(
      await fs.pathExists(
        path.join(tmpDir, CLAUDE_DIR, "skills", "seo-brief", "SKILL.md"),
      ),
    ).toBe(true);
    // but not eng-spec
    expect(
      await fs.pathExists(
        path.join(tmpDir, CLAUDE_DIR, "skills", "eng-spec", "SKILL.md"),
      ),
    ).toBe(false);
  });

  it("doctor passes on a fresh workspace with CLAUDE.md renamed", async () => {
    await initAction(defaultOpts(tmpDir));

    // Simulate the user renaming CLAUDE.example.md → CLAUDE.md
    await fs.rename(
      path.join(tmpDir, CLAUDE_EXAMPLE_FILE),
      path.join(tmpDir, CLAUDE_MD_FILE),
    );

    const originalExitCode = process.exitCode;
    process.exitCode = undefined;
    await doctorAction({ dir: tmpDir });
    expect(process.exitCode).not.toBe(1);
    process.exitCode = originalExitCode;
  });
});
