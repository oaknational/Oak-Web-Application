#!/usr/bin/env bash
# Shows all outdated packages, sorted by update type (major → minor → patch)

set -euo pipefail

json=$(npm outdated --json 2>/dev/null || true)

if [ -z "$json" ] || [ "$json" = "{}" ]; then
  echo "✅ All packages are up to date."
  exit 0
fi

echo "$json" | node -e "
const semver = (v) => v.replace(/^v/, '').split('.').map(Number);

function updateType(current, latest) {
  const [cMaj, cMin] = semver(current);
  const [lMaj, lMin] = semver(latest);
  if (cMaj !== lMaj) return 'major';
  if (cMin !== lMin) return 'minor';
  return 'patch';
}

function versionDistance(current, latest) {
  const c = semver(current);
  const l = semver(latest);
  return [l[0] - c[0], l[1] - c[1], l[2] - c[2]];
}

const typeOrder = { major: 0, minor: 1, patch: 2 };

let input = '';
process.stdin.on('data', (d) => (input += d));
process.stdin.on('end', () => {
  const data = JSON.parse(input);

  const rows = Object.entries(data)
    .filter(([, info]) => info.current !== 'MISSING')
    .map(([pkg, info]) => {
      const dist = versionDistance(info.current, info.latest);
      return {
        pkg,
        current: info.current,
        wanted: info.wanted,
        latest: info.latest,
        type: updateType(info.current, info.latest),
        dist,
      };
    })
    .sort((a, b) => {
      const typeDiff = typeOrder[a.type] - typeOrder[b.type];
      if (typeDiff !== 0) return typeDiff;
      for (let i = 0; i < 3; i++) {
        if (b.dist[i] !== a.dist[i]) return b.dist[i] - a.dist[i];
      }
      return a.pkg.localeCompare(b.pkg);
    });

  if (rows.length === 0) {
    console.log('✅ All packages are up to date.');
    process.exit(0);
  }

  const red = (s) => \`\x1b[31m\${s}\x1b[0m\`;
  const yellow = (s) => \`\x1b[33m\${s}\x1b[0m\`;
  const green = (s) => \`\x1b[32m\${s}\x1b[0m\`;
  const bold = (s) => \`\x1b[1m\${s}\x1b[0m\`;
  const dim = (s) => \`\x1b[2m\${s}\x1b[0m\`;

  const colorType = (t) => ({ major: red(t), minor: yellow(t), patch: green(t) }[t]);

  const cols = {
    pkg: Math.max(7, ...rows.map((r) => r.pkg.length)),
    current: Math.max(7, ...rows.map((r) => r.current.length)),
    wanted: Math.max(6, ...rows.map((r) => r.wanted.length)),
    latest: Math.max(6, ...rows.map((r) => r.latest.length)),
    type: 6,
  };

  const pad = (s, n) => s + ' '.repeat(Math.max(0, n - s.length));

  console.log(
    bold(
      pad('Package', cols.pkg) +
        '  ' +
        pad('Current', cols.current) +
        '  ' +
        pad('Wanted', cols.wanted) +
        '  ' +
        pad('Latest', cols.latest) +
        '  ' +
        'Update',
    ),
  );
  console.log(dim('─'.repeat(cols.pkg + cols.current + cols.wanted + cols.latest + cols.type + 12)));

  const counts = { major: 0, minor: 0, patch: 0 };

  for (const r of rows) {
    counts[r.type]++;
    console.log(
      pad(r.pkg, cols.pkg) +
        '  ' +
        pad(r.current, cols.current) +
        '  ' +
        pad(r.wanted, cols.wanted) +
        '  ' +
        pad(r.latest, cols.latest) +
        '  ' +
        colorType(r.type),
    );
  }

  console.log();
  console.log(
    \`\${rows.length} updatable: \${red(counts.major + ' major')}, \${yellow(counts.minor + ' minor')}, \${green(counts.patch + ' patch')}\`,
  );
});
"
