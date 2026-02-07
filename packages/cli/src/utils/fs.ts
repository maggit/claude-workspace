import fs from "fs-extra";
import crypto from "node:crypto";
import path from "node:path";

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function hashFile(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, "utf-8");
  return hashString(content);
}

export function hashString(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

export async function backupFile(filePath: string): Promise<string> {
  const timestamp = Date.now();
  const ext = path.extname(filePath);
  const base = ext ? filePath.slice(0, -ext.length) : filePath;
  const backupPath = `${base}.bak.${timestamp}${ext}`;
  await fs.copy(filePath, backupPath);
  return backupPath;
}

export async function safeWriteFile(
  filePath: string,
  content: string,
): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf-8");
}

export async function safeReadFile(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}
