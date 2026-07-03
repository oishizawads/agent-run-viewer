// Copies JSON log files from /data (human-editable source of truth)
// to /public/data so the static-exported app can fetch them at runtime.
// Runs automatically via predev / prebuild hooks.
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = import.meta.dirname;
const src = path.join(root, '..', 'data');
const dest = path.join(root, '..', 'public', 'data');

if (existsSync(dest)) {
  await rm(dest, { recursive: true, force: true });
}
await mkdir(dest, { recursive: true });

if (!existsSync(src)) {
  console.warn('[sync-data] No /data directory found; created empty /public/data.');
  process.exit(0);
}

const entries = await readdir(src, { withFileTypes: true });
let count = 0;
for (const entry of entries) {
  if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
  await cp(path.join(src, entry.name), path.join(dest, entry.name));
  count += 1;
}
console.log(`[sync-data] Copied ${count} JSON file(s) to /public/data.`);
