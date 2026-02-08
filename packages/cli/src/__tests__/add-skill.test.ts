import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import fs from "fs-extra";
import os from "node:os";
import { installSingleSkill, buildExistingHashes } from "../services/scaffold-claude-dir.js";
import { readActiveProfile, writeActiveProfile } from "../services/active-profile.js";
import { validateSkillName, getAvailableSkillNames, listAvailableSkills, parseFrontmatter } from "../services/skills.js";
import { hashString } from "../utils/fs.js";

describe("add-skill", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "claude-workstation-test-"));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("installs a single skill to .claude/skills/<name>/SKILL.md", async () => {
    await fs.ensureDir(path.join(tmpDir, ".claude", "skills"));
    const result = await installSingleSkill(
      tmpDir,
      "prd",
      new Map(),
      { force: false, dryRun: false },
    );

    expect(result).not.toBeNull();
    expect(result!.path).toBe(path.join(".claude", "skills", "prd", "SKILL.md"));
    expect(result!.hash).toMatch(/^[a-f0-9]{64}$/);

    const skillPath = path.join(tmpDir, ".claude", "skills", "prd", "SKILL.md");
    expect(await fs.pathExists(skillPath)).toBe(true);
    const content = await fs.readFile(skillPath, "utf-8");
    expect(content).toContain("prd");
  });

  it("creates .claude/skills/ even without prior init", async () => {
    // Don't create any dirs first — installSingleSkill should handle it
    const result = await installSingleSkill(
      tmpDir,
      "debug",
      new Map(),
      { force: false, dryRun: false },
    );

    expect(result).not.toBeNull();
    const skillPath = path.join(tmpDir, ".claude", "skills", "debug", "SKILL.md");
    expect(await fs.pathExists(skillPath)).toBe(true);
  });

  it("updates active.json with new skill entry", async () => {
    await fs.ensureDir(path.join(tmpDir, ".claude", "profiles"));
    const result = await installSingleSkill(
      tmpDir,
      "prd",
      new Map(),
      { force: false, dryRun: false },
    );

    expect(result).not.toBeNull();

    // Write to active.json like the action does
    await writeActiveProfile(tmpDir, "custom", [result!], { dryRun: false });
    const active = await readActiveProfile(tmpDir);
    expect(active).not.toBeNull();
    expect(active!.managedFiles).toHaveLength(1);
    expect(active!.managedFiles[0].path).toBe(result!.path);
  });

  it("merges with existing active.json from init", async () => {
    await fs.ensureDir(path.join(tmpDir, ".claude", "profiles"));

    // Simulate existing active.json from a prior init
    const existingFile = {
      path: path.join(".claude", "skills", "debug", "SKILL.md"),
      hash: "abc123",
    };
    await writeActiveProfile(tmpDir, "default", [existingFile], { dryRun: false });

    // Install a new skill
    const result = await installSingleSkill(
      tmpDir,
      "prd",
      buildExistingHashes(await readActiveProfile(tmpDir)),
      { force: false, dryRun: false },
    );

    expect(result).not.toBeNull();

    // Merge like the action does
    const existing = await readActiveProfile(tmpDir);
    const merged = existing!.managedFiles.filter((mf) => mf.path !== result!.path);
    merged.push(result!);
    await writeActiveProfile(tmpDir, existing!.profile, merged, { dryRun: false });

    const final = await readActiveProfile(tmpDir);
    expect(final!.managedFiles).toHaveLength(2);
  });

  it("skips existing unmanaged skills without --force", async () => {
    // Create an unmanaged skill manually
    const skillDir = path.join(tmpDir, ".claude", "skills", "prd");
    await fs.ensureDir(skillDir);
    await fs.writeFile(path.join(skillDir, "SKILL.md"), "# My custom PRD skill\n");

    // No entry in existingHashes — this is unmanaged
    const result = await installSingleSkill(
      tmpDir,
      "prd",
      new Map(),
      { force: false, dryRun: false },
    );

    // Should return null (skipped)
    expect(result).toBeNull();

    // Original content preserved
    const content = await fs.readFile(path.join(skillDir, "SKILL.md"), "utf-8");
    expect(content).toBe("# My custom PRD skill\n");
  });

  it("overwrites unmanaged skill with --force", async () => {
    // Create an unmanaged skill manually
    const skillDir = path.join(tmpDir, ".claude", "skills", "prd");
    await fs.ensureDir(skillDir);
    await fs.writeFile(path.join(skillDir, "SKILL.md"), "# My custom PRD skill\n");

    const result = await installSingleSkill(
      tmpDir,
      "prd",
      new Map(),
      { force: true, dryRun: false },
    );

    expect(result).not.toBeNull();
    expect(result!.hash).toMatch(/^[a-f0-9]{64}$/);

    // Content should now be the CLI's version
    const content = await fs.readFile(path.join(skillDir, "SKILL.md"), "utf-8");
    expect(content).toContain("Product Requirements Document");
  });

  it("dry-run creates no files", async () => {
    const result = await installSingleSkill(
      tmpDir,
      "prd",
      new Map(),
      { force: false, dryRun: true },
    );

    expect(result).not.toBeNull();

    // The skill directory should NOT actually exist
    const skillPath = path.join(tmpDir, ".claude", "skills", "prd", "SKILL.md");
    expect(await fs.pathExists(skillPath)).toBe(false);
  });
});

describe("skills service", () => {
  it("validates known skill names", async () => {
    expect(await validateSkillName("prd")).toBe(true);
    expect(await validateSkillName("debug")).toBe(true);
  });

  it("rejects unknown skill names", async () => {
    expect(await validateSkillName("nonexistent-skill-xyz")).toBe(false);
  });

  it("lists available skill names", async () => {
    const names = await getAvailableSkillNames();
    expect(names.length).toBeGreaterThan(0);
    expect(names).toContain("prd");
    expect(names).toContain("debug");
  });

  it("lists skills with descriptions", async () => {
    const skills = await listAvailableSkills();
    expect(skills.length).toBeGreaterThan(0);
    const prd = skills.find((s) => s.name === "prd");
    expect(prd).toBeDefined();
    expect(prd!.description.length).toBeGreaterThan(0);
  });

  it("parses YAML frontmatter", () => {
    const content = `---
name: test-skill
description: "A test skill for testing"
---

# Content here`;

    const fm = parseFrontmatter(content);
    expect(fm.name).toBe("test-skill");
    expect(fm.description).toBe("A test skill for testing");
  });

  it("handles missing frontmatter", () => {
    const fm = parseFrontmatter("# Just a heading\nSome content");
    expect(fm.name).toBe("");
    expect(fm.description).toBe("");
  });
});
