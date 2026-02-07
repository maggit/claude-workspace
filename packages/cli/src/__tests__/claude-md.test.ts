import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import fs from "fs-extra";
import os from "node:os";
import {
  generateClaudeMdContent,
  writeClaudeExampleMd,
} from "../services/claude-md.js";
import { loadProfile } from "../services/profiles.js";
import { CLAUDE_EXAMPLE_FILE } from "../constants.js";

describe("claude-md", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "claude-workstation-test-"));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  describe("generateClaudeMdContent", () => {
    it("generates content with vault path", async () => {
      const profile = await loadProfile("default");
      const content = await generateClaudeMdContent(profile, "ContextDB");
      expect(content).toContain("ContextDB");
    });

    it("includes skill instructions", async () => {
      const profile = await loadProfile("default");
      const content = await generateClaudeMdContent(profile, "ContextDB");
      expect(content).toContain("prd.md");
      expect(content).toContain(".claude/skills/");
    });

    it("includes folder list", async () => {
      const profile = await loadProfile("default");
      const content = await generateClaudeMdContent(profile, "MyVault");
      expect(content).toContain("MyVault/00_inbox/");
      expect(content).toContain("MyVault/08_todos/");
    });

    it("includes naming conventions", async () => {
      const profile = await loadProfile("default");
      const content = await generateClaudeMdContent(profile, "ContextDB");
      expect(content).toContain("lowercase with hyphens");
    });
  });

  describe("writeClaudeExampleMd", () => {
    it("writes CLAUDE.example.md", async () => {
      await writeClaudeExampleMd(tmpDir, "test content", { dryRun: false });
      const result = await fs.readFile(
        path.join(tmpDir, CLAUDE_EXAMPLE_FILE),
        "utf-8",
      );
      expect(result).toBe("test content");
    });

    it("overwrites existing CLAUDE.example.md on re-run", async () => {
      await writeClaudeExampleMd(tmpDir, "first", { dryRun: false });
      await writeClaudeExampleMd(tmpDir, "second", { dryRun: false });
      const result = await fs.readFile(
        path.join(tmpDir, CLAUDE_EXAMPLE_FILE),
        "utf-8",
      );
      expect(result).toBe("second");
    });

    it("does not write in dry-run mode", async () => {
      await writeClaudeExampleMd(tmpDir, "test", { dryRun: true });
      expect(
        await fs.pathExists(path.join(tmpDir, CLAUDE_EXAMPLE_FILE)),
      ).toBe(false);
    });
  });
});
