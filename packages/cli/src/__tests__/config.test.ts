import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import fs from "fs-extra";
import os from "node:os";
import { createConfig, writeConfig, readConfig } from "../services/config.js";

describe("config", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "claude-workstation-test-"));
    await fs.ensureDir(path.join(tmpDir, ".claude"));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("creates config with expected fields", () => {
    const config = createConfig("default", "ContextDB");
    expect(config.version).toBe("0.1.0");
    expect(config.profile).toBe("default");
    expect(config.vaultPath).toBe("ContextDB");
    expect(config.createdAt).toBeTruthy();
    expect(config.updatedAt).toBeTruthy();
  });

  it("writes and reads config", async () => {
    const config = createConfig("default", "ContextDB");
    await writeConfig(tmpDir, config, { dryRun: false });

    const read = await readConfig(tmpDir);
    expect(read).not.toBeNull();
    expect(read!.profile).toBe("default");
    expect(read!.vaultPath).toBe("ContextDB");
  });

  it("preserves createdAt on re-write", async () => {
    const config1 = createConfig("default", "ContextDB");
    await writeConfig(tmpDir, config1, { dryRun: false });

    const read1 = await readConfig(tmpDir);

    // Small delay to ensure updatedAt would differ
    const config2 = createConfig("marketing", "ContextDB");
    await writeConfig(tmpDir, config2, { dryRun: false });

    const read2 = await readConfig(tmpDir);
    expect(read2!.createdAt).toBe(read1!.createdAt);
    expect(read2!.profile).toBe("marketing");
  });

  it("returns null for missing config", async () => {
    const emptyDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "claude-workstation-test-"),
    );
    try {
      const read = await readConfig(emptyDir);
      expect(read).toBeNull();
    } finally {
      await fs.remove(emptyDir);
    }
  });

  it("does not write in dry-run mode", async () => {
    const config = createConfig("default", "ContextDB");
    await writeConfig(tmpDir, config, { dryRun: true });

    const read = await readConfig(tmpDir);
    expect(read).toBeNull();
  });
});
