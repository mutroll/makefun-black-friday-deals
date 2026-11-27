// Plunge — Black Friday 2026 deal finder: hand-in program.
//
// Copies app/ and screenshots/ from this repository into the output
// directory and writes /output/dossier.json with buildDossier from
// vendor/makefun-frontend.ts. Standard library only, deterministic:
// two runs over the same repository write the same bytes.
//
// The output directory itself is never deleted (on the grader it is
// owned by another user), only its contents are cleared. Files the
// program writes are left readable by every user.

import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
  chmodSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));

function clearContents(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    return;
  }
  const names = readdirSync(dir).sort();
  for (const name of names) {
    rmSync(join(dir, name), { recursive: true, force: true });
  }
}

function copyTree(from: string, to: string): number {
  const names = readdirSync(from).sort();
  mkdirSync(to, { recursive: true });
  let copied = 0;
  for (const name of names) {
    const source = join(from, name);
    const target = join(to, name);
    if (statSync(source).isDirectory()) {
      copied += copyTree(source, target);
    } else {
      cpSync(source, target);
      chmodSync(target, 0o644);
      copied += 1;
    }
  }
  chmodSync(to, 0o755);
  return copied;
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  clearContents(outDir);
  const appFiles = copyTree(join(repoRoot, "app"), join(outDir, "app"));
  const shotFiles = copyTree(join(repoRoot, "screenshots"), join(outDir, "screenshots"));
  console.log("copied " + appFiles + " app files and " + shotFiles + " screenshots");
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  });
  const dossierPath = join(outDir, "dossier.json");
  writeFileSync(dossierPath, dossier);
  chmodSync(dossierPath, 0o644);
  const bytes = readFileSync(dossierPath).length;
  console.log("wrote " + dossierPath + " (" + bytes + " bytes)");
}

main();
