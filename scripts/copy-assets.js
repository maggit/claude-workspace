#!/usr/bin/env node

/**
 * Copies canonical asset files from repo root into packages/cli/assets/
 * for bundling with the CLI package.
 *
 * Copies: skills/, templates/, profiles/ → packages/cli/assets/
 */

import { cpSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, "..");
const assetsDir = resolve(root, "packages/cli/assets");

const copies = [
  { src: "skills", dest: "skills" },
  { src: "templates", dest: "templates" },
  { src: "profiles", dest: "profiles" },
];

for (const { src, dest } of copies) {
  const srcPath = resolve(root, src);
  const destPath = resolve(assetsDir, dest);

  if (!existsSync(srcPath)) {
    console.warn(`Warning: source directory ${src}/ not found, skipping`);
    continue;
  }

  mkdirSync(destPath, { recursive: true });
  cpSync(srcPath, destPath, { recursive: true });
  console.log(`Copied ${src}/ → packages/cli/assets/${dest}/`);
}

console.log("Asset copy complete.");
