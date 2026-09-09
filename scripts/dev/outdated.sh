#!/usr/bin/env bash
# Shows all outdated packages, sorted by update type (major → minor → patch).
#
# `pnpm outdated` is the source of truth: it honours the supply-chain policy in
# pnpm-workspace.yaml (minimumReleaseAge), so its "latest" is the newest version
# this repo can actually install today. `npm outdated` is consulted only to spot
# newer versions the policy is currently withholding — those show as "held".

set -euo pipefail

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

# Both hit the registry, so run them concurrently.
pnpm outdated --json >"$tmp/pnpm.json" 2>/dev/null || true &
npm outdated --json >"$tmp/npm.json" 2>/dev/null || true &
wait

# Release-age window, in minutes, from pnpm-workspace.yaml. Reported in the
# summary so the "held" column has a stated reason. Absent is fine.
release_age=$(sed -n 's/^minimumReleaseAge:[[:space:]]*\([0-9]\{1,\}\).*/\1/p' pnpm-workspace.yaml 2>/dev/null | head -1)

PNPM_JSON="$tmp/pnpm.json" NPM_JSON="$tmp/npm.json" RELEASE_AGE="${release_age:-}" \
  node -e "$(cat <<'NODE'
const fs = require('fs');

// pnpm prepends engine warnings to stdout, so skip to the first real JSON line.
const readJson = (path) => {
  let raw;
  try { raw = fs.readFileSync(path, 'utf8'); } catch { return {}; }
  const lines = raw.split('\n');
  const start = lines.findIndex((l) => l.trimStart().startsWith('{') && !l.includes('[WARN]'));
  if (start === -1) return {};
  try { return JSON.parse(lines.slice(start).join('\n')); } catch { return {}; }
};

const { PNPM_JSON: pnpmPath, NPM_JSON: npmPath, RELEASE_AGE: releaseAgeMins } = process.env;
const installable = readJson(pnpmPath);
const published = readJson(npmPath);

const entries = Object.entries(installable).filter(([, i]) => i.current && i.latest);

if (entries.length === 0) {
  console.log('✅ All packages are up to date.');
  process.exit(0);
}

const parts = (v) => String(v).replace(/^v/, '').split(/[.-]/);
const num = (v, i) => parseInt(parts(v)[i] || '0', 10) || 0;
const cmp = (a, b) => num(a, 0) - num(b, 0) || num(a, 1) - num(b, 1) || num(a, 2) - num(b, 2);

const updateType = (current, latest) => {
  if (num(current, 0) !== num(latest, 0)) return 'major';
  if (num(current, 1) !== num(latest, 1)) return 'minor';
  return 'patch';
};

const typeOrder = { major: 0, minor: 1, patch: 2 };

const rows = entries
  .map(([pkg, info]) => {
    // A strictly newer published version means the policy is withholding it.
    // npm reporting something older just means npm resolved it differently.
    const newer = published[pkg] && published[pkg].latest;
    const held = newer && cmp(newer, info.latest) > 0 ? newer : '';
    return {
      pkg,
      current: info.current,
      latest: info.latest,
      type: updateType(info.current, info.latest),
      held,
      deprecated: Boolean(info.isDeprecated),
      dist: [num(info.latest, 0) - num(info.current, 0), num(info.latest, 1) - num(info.current, 1), num(info.latest, 2) - num(info.current, 2)],
    };
  })
  .sort((a, b) => {
    const typeDiff = typeOrder[a.type] - typeOrder[b.type];
    if (typeDiff !== 0) return typeDiff;
    for (let i = 0; i < 3; i++) if (b.dist[i] !== a.dist[i]) return b.dist[i] - a.dist[i];
    return a.pkg.localeCompare(b.pkg);
  });

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const magenta = (s) => `\x1b[35m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

const colorType = (t) => ({ major: red(t), minor: yellow(t), patch: green(t) }[t]);

const noteOf = (r) => {
  const notes = [];
  if (r.held) notes.push(magenta(`held ${r.held}`));
  if (r.deprecated) notes.push(red('deprecated'));
  return notes.join(' ');
};
const noteWidth = (r) => (r.held ? `held ${r.held}`.length : 0) + (r.deprecated ? 'deprecated'.length : 0) + (r.held && r.deprecated ? 1 : 0);

const cols = {
  pkg: Math.max(7, ...rows.map((r) => r.pkg.length)),
  current: Math.max(7, ...rows.map((r) => r.current.length)),
  latest: Math.max(6, ...rows.map((r) => r.latest.length)),
  type: 6,
  note: Math.max(0, ...rows.map(noteWidth)),
};

const pad = (s, n) => s + ' '.repeat(Math.max(0, n - s.length));

console.log(
  bold(
    pad('Package', cols.pkg) + '  ' +
    pad('Current', cols.current) + '  ' +
    pad('Latest', cols.latest) + '  ' +
    pad('Update', cols.type) + (cols.note ? '  Notes' : ''),
  ),
);
console.log(dim('─'.repeat(cols.pkg + cols.current + cols.latest + cols.type + cols.note + 8)));

const counts = { major: 0, minor: 0, patch: 0 };
let heldCount = 0;
let deprecatedCount = 0;

for (const r of rows) {
  counts[r.type]++;
  if (r.held) heldCount++;
  if (r.deprecated) deprecatedCount++;
  console.log(
    pad(r.pkg, cols.pkg) + '  ' +
    pad(r.current, cols.current) + '  ' +
    pad(r.latest, cols.latest) + '  ' +
    colorType(r.type) + ' '.repeat(Math.max(0, cols.type - r.type.length)) +
    (cols.note ? '  ' + noteOf(r) : ''),
  );
}

console.log();
console.log(
  `${rows.length} updatable: ${red(counts.major + ' major')}, ${yellow(counts.minor + ' minor')}, ${green(counts.patch + ' patch')}`,
);

if (heldCount > 0) {
  const days = releaseAgeMins ? Math.round(Number(releaseAgeMins) / 1440) : null;
  const window = days ? `${days}-day release-age policy` : 'release-age policy';
  console.log(
    magenta(`${heldCount} held`) + dim(`  a newer version exists but the ${window} in pnpm-workspace.yaml blocks it today`),
  );
}

if (deprecatedCount > 0) {
  console.log(red(`${deprecatedCount} deprecated`) + dim('  upstream has marked the installed version deprecated'));
}
NODE
)"
