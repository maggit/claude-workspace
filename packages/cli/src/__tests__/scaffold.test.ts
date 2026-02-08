import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import fs from "fs-extra";
import os from "node:os";
import { scaffoldClaudeDir } from "../services/scaffold-claude-dir.js";
import { scaffoldVault } from "../services/scaffold-vault.js";
import { loadProfile } from "../services/profiles.js";
import { CLAUDE_SUBDIRS, VAULT_FOLDERS } from "../constants.js";

describe("scaffold-claude-dir", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "claude-workstation-test-"));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("creates .claude/ subdirectories", async () => {
    const profile = await loadProfile("default");
    await scaffoldClaudeDir(tmpDir, profile, { force: false, dryRun: false }, null);

    for (const subdir of CLAUDE_SUBDIRS) {
      expect(await fs.pathExists(path.join(tmpDir, ".claude", subdir))).toBe(
        true,
      );
    }
  });

  it("copies skill files for the profile", async () => {
    const profile = await loadProfile("default");
    await scaffoldClaudeDir(tmpDir, profile, { force: false, dryRun: false }, null);

    for (const skill of profile.skills) {
      const skillPath = path.join(tmpDir, ".claude", "skills", skill, "SKILL.md");
      expect(await fs.pathExists(skillPath)).toBe(true);
      const content = await fs.readFile(skillPath, "utf-8");
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it("copies template files for the profile", async () => {
    const profile = await loadProfile("default");
    await scaffoldClaudeDir(tmpDir, profile, { force: false, dryRun: false }, null);

    for (const tmpl of profile.templates) {
      const tmplPath = path.join(tmpDir, ".claude", "templates", tmpl);
      expect(await fs.pathExists(tmplPath)).toBe(true);
    }
  });

  it("returns managed files with hashes", async () => {
    const profile = await loadProfile("default");
    const result = await scaffoldClaudeDir(
      tmpDir,
      profile,
      { force: false, dryRun: false },
      null,
    );

    expect(result.managedFiles.length).toBe(
      profile.skills.length + profile.templates.length,
    );
    for (const mf of result.managedFiles) {
      expect(mf.path).toBeTruthy();
      expect(mf.hash).toMatch(/^[a-f0-9]{64}$/);
    }
  });

  it("is idempotent — second run produces same result", async () => {
    const profile = await loadProfile("default");
    const result1 = await scaffoldClaudeDir(
      tmpDir,
      profile,
      { force: false, dryRun: false },
      null,
    );
    const result2 = await scaffoldClaudeDir(
      tmpDir,
      profile,
      { force: false, dryRun: false },
      { profile: "default", installedAt: new Date().toISOString(), managedFiles: result1.managedFiles },
    );

    expect(result2.managedFiles.length).toBe(result1.managedFiles.length);
  });

  it("does not create files in dry-run mode", async () => {
    const profile = await loadProfile("indie-maker");
    await scaffoldClaudeDir(tmpDir, profile, { force: false, dryRun: true }, null);

    expect(await fs.pathExists(path.join(tmpDir, ".claude", "skills"))).toBe(
      false,
    );
  });

  it("skips existing unmanaged skill (returns null, preserves user content)", async () => {
    const profile = await loadProfile("default");

    // Manually create an unmanaged skill before running init
    const customDir = path.join(tmpDir, ".claude", "skills", "prd");
    await fs.ensureDir(customDir);
    await fs.writeFile(path.join(customDir, "SKILL.md"), "# My custom PRD\n");

    // Run scaffold with no existing active profile (nothing tracked)
    const result = await scaffoldClaudeDir(
      tmpDir,
      profile,
      { force: false, dryRun: false },
      null,
    );

    // prd should NOT be in managed files (was skipped)
    const prdEntry = result.managedFiles.find((mf) =>
      mf.path.includes("prd"),
    );
    expect(prdEntry).toBeUndefined();

    // Custom content should be preserved
    const content = await fs.readFile(path.join(customDir, "SKILL.md"), "utf-8");
    expect(content).toBe("# My custom PRD\n");

    // Other skills should still be installed
    expect(result.managedFiles.length).toBe(
      profile.skills.length + profile.templates.length - 1,
    );
  });

  it("overwrites unmanaged skill with --force", async () => {
    const profile = await loadProfile("default");

    // Manually create an unmanaged skill
    const customDir = path.join(tmpDir, ".claude", "skills", "prd");
    await fs.ensureDir(customDir);
    await fs.writeFile(path.join(customDir, "SKILL.md"), "# My custom PRD\n");

    const result = await scaffoldClaudeDir(
      tmpDir,
      profile,
      { force: true, dryRun: false },
      null,
    );

    // prd should now be in managed files
    const prdEntry = result.managedFiles.find((mf) =>
      mf.path.includes("prd"),
    );
    expect(prdEntry).toBeDefined();

    // Content should now be the CLI's version
    const content = await fs.readFile(path.join(customDir, "SKILL.md"), "utf-8");
    expect(content).toContain("Product Requirements Document");
  });

  it("only installs profile-specific skills", async () => {
    const profile = await loadProfile("marketing");
    await scaffoldClaudeDir(tmpDir, profile, { force: false, dryRun: false }, null);

    // marketing should have seo-brief but not eng-spec
    expect(
      await fs.pathExists(
        path.join(tmpDir, ".claude", "skills", "seo-brief", "SKILL.md"),
      ),
    ).toBe(true);
    expect(
      await fs.pathExists(
        path.join(tmpDir, ".claude", "skills", "eng-spec", "SKILL.md"),
      ),
    ).toBe(false);
  });
});

describe("scaffold-vault", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "claude-workstation-test-"));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("creates vault with all numbered folders", async () => {
    await scaffoldVault(tmpDir, "ContextDB", { dryRun: false });

    for (const folder of VAULT_FOLDERS) {
      expect(
        await fs.pathExists(path.join(tmpDir, "ContextDB", folder)),
      ).toBe(true);
    }
  });

  it("creates .gitkeep in each subfolder", async () => {
    await scaffoldVault(tmpDir, "ContextDB", { dryRun: false });

    for (const folder of VAULT_FOLDERS) {
      expect(
        await fs.pathExists(
          path.join(tmpDir, "ContextDB", folder, ".gitkeep"),
        ),
      ).toBe(true);
    }
  });

  it("creates vault README and _index", async () => {
    await scaffoldVault(tmpDir, "ContextDB", { dryRun: false });

    expect(
      await fs.pathExists(path.join(tmpDir, "ContextDB", "README.md")),
    ).toBe(true);
    expect(
      await fs.pathExists(path.join(tmpDir, "ContextDB", "_index.md")),
    ).toBe(true);
  });

  it("is idempotent — second run does not error", async () => {
    await scaffoldVault(tmpDir, "ContextDB", { dryRun: false });
    await scaffoldVault(tmpDir, "ContextDB", { dryRun: false });

    // Just verify no error thrown and files still present
    expect(
      await fs.pathExists(path.join(tmpDir, "ContextDB", "README.md")),
    ).toBe(true);
  });

  it("does not create files in dry-run", async () => {
    await scaffoldVault(tmpDir, "ContextDB", { dryRun: true });
    expect(await fs.pathExists(path.join(tmpDir, "ContextDB"))).toBe(false);
  });

  it("uses custom vault name", async () => {
    await scaffoldVault(tmpDir, "my-vault", { dryRun: false });
    expect(await fs.pathExists(path.join(tmpDir, "my-vault"))).toBe(true);
    expect(
      await fs.pathExists(path.join(tmpDir, "my-vault", "00_inbox")),
    ).toBe(true);
  });
});
