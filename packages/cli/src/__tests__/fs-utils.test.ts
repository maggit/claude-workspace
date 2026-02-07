import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import fs from "fs-extra";
import os from "node:os";
import { fileExists, hashFile, hashString, backupFile, safeWriteFile, safeReadFile } from "../utils/fs.js";

describe("fs utils", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "claude-workstation-test-"));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  describe("fileExists", () => {
    it("returns true for existing file", async () => {
      const filePath = path.join(tmpDir, "test.txt");
      await fs.writeFile(filePath, "hello");
      expect(await fileExists(filePath)).toBe(true);
    });

    it("returns false for non-existing file", async () => {
      expect(await fileExists(path.join(tmpDir, "nope.txt"))).toBe(false);
    });
  });

  describe("hashFile / hashString", () => {
    it("produces consistent SHA-256 hash", async () => {
      const filePath = path.join(tmpDir, "test.txt");
      await fs.writeFile(filePath, "hello world");
      const fileHash = await hashFile(filePath);
      const stringHash = hashString("hello world");
      expect(fileHash).toBe(stringHash);
      expect(fileHash).toMatch(/^[a-f0-9]{64}$/);
    });

    it("different content produces different hashes", () => {
      expect(hashString("a")).not.toBe(hashString("b"));
    });
  });

  describe("backupFile", () => {
    it("creates a backup with timestamp", async () => {
      const filePath = path.join(tmpDir, "test.md");
      await fs.writeFile(filePath, "original");
      const backupPath = await backupFile(filePath);
      expect(await fs.pathExists(backupPath)).toBe(true);
      expect(await fs.readFile(backupPath, "utf-8")).toBe("original");
      expect(backupPath).toMatch(/\.bak\.\d+\.md$/);
    });
  });

  describe("safeWriteFile", () => {
    it("creates intermediate directories", async () => {
      const filePath = path.join(tmpDir, "a", "b", "c", "test.txt");
      await safeWriteFile(filePath, "deep");
      expect(await fs.readFile(filePath, "utf-8")).toBe("deep");
    });
  });

  describe("safeReadFile", () => {
    it("returns content for existing file", async () => {
      const filePath = path.join(tmpDir, "test.txt");
      await fs.writeFile(filePath, "content");
      expect(await safeReadFile(filePath)).toBe("content");
    });

    it("returns null for non-existing file", async () => {
      expect(await safeReadFile(path.join(tmpDir, "nope.txt"))).toBeNull();
    });
  });
});
