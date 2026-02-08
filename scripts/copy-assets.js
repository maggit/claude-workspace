#!/usr/bin/env node

/**
 * Copies canonical asset files from repo root into packages/cli/assets/
 * for bundling with the CLI package.
 *
 * Copies: skills/, templates/, profiles/ → packages/cli/assets/
 */

import { cpSync, copyFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
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

  if (existsSync(destPath)) {
    rmSync(destPath, { recursive: true });
  }
  mkdirSync(destPath, { recursive: true });
  cpSync(srcPath, destPath, { recursive: true });
  console.log(`Copied ${src}/ → packages/cli/assets/${dest}/`);
}

// Copy README.md and LICENSE to packages/cli/ for npm publish
const cliDir = resolve(root, "packages/cli");
for (const file of ["README.md", "LICENSE"]) {
  const srcPath = resolve(root, file);
  const destPath = resolve(cliDir, file);
  if (existsSync(srcPath)) {
    copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} → packages/cli/${file}`);
  } else {
    console.warn(`Warning: ${file} not found in repo root, skipping`);
  }
}

console.log("Asset copy complete.");
