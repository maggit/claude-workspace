import { describe, it, expect } from "vitest";
import { loadProfile, listProfiles } from "../services/profiles.js";

describe("profiles", () => {
  it("loads default profile", async () => {
    const profile = await loadProfile("default");
    expect(profile.name).toBe("default");
    expect(profile.skills.length).toBeGreaterThan(0);
    expect(profile.templates.length).toBeGreaterThan(0);
    expect(profile.claudeMdTemplate).toBe("default.md");
  });

  it("loads engineering-exec profile", async () => {
    const profile = await loadProfile("engineering-exec");
    expect(profile.name).toBe("engineering-exec");
    expect(profile.skills).toContain("eng-spec.md");
    expect(profile.skills).not.toContain("seo-brief.md");
  });

  it("loads indie-maker profile", async () => {
    const profile = await loadProfile("indie-maker");
    expect(profile.name).toBe("indie-maker");
    expect(profile.skills).toContain("prd.md");
    expect(profile.skills).toContain("todo.md");
  });

  it("loads marketing profile", async () => {
    const profile = await loadProfile("marketing");
    expect(profile.name).toBe("marketing");
    expect(profile.skills).toContain("seo-brief.md");
    expect(profile.skills).toContain("landing-page-copy.md");
  });

  it("throws on unknown profile", async () => {
    await expect(loadProfile("nonexistent")).rejects.toThrow("Unknown profile");
  });

  it("lists all profiles", async () => {
    const profiles = await listProfiles();
    expect(profiles).toHaveLength(4);
    expect(profiles.map((p) => p.name)).toEqual([
      "default",
      "engineering-exec",
      "indie-maker",
      "marketing",
    ]);
  });
});
