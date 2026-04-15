#!/usr/bin/env bash
# Shows npm audit vulnerabilities sorted by severity, categorised by fix type

set -euo pipefail

json=$(npm audit --json 2>/dev/null || true)

if [ -z "$json" ] || [ "$json" = "{}" ]; then
  echo "✅ No vulnerabilities found."
  exit 0
fi

echo "$json" | node -e "
let input = '';
process.stdin.on('data', (d) => (input += d));
process.stdin.on('end', () => {
  const data = JSON.parse(input);
  const vulns = data.vulnerabilities || {};

  if (Object.keys(vulns).length === 0) {
    console.log('✅ No vulnerabilities found.');
    process.exit(0);
  }

  const sevOrder = { critical: 0, high: 1, moderate: 2, low: 3, info: 4 };

  const rows = Object.entries(vulns).map(([name, info]) => {
    let fixType;
    if (info.fixAvailable === true) {
      fixType = 'auto-fixable';
    } else if (info.fixAvailable && typeof info.fixAvailable === 'object') {
      if (info.fixAvailable.isSemVerMajor) {
        fixType = 'breaking fix';
      } else {
        fixType = 'auto-fixable';
      }
    } else {
      fixType = 'no fix';
    }

    const via = Array.isArray(info.via)
      ? info.via.map((v) => (typeof v === 'string' ? v : v.title || v.url || 'unknown')).join(', ')
      : String(info.via);

    return {
      name,
      severity: info.severity || 'info',
      fixType,
      via: via.length > 50 ? via.slice(0, 47) + '...' : via,
      range: info.range || '',
    };
  });

  const fixOrder = { 'auto-fixable': 0, 'breaking fix': 1, 'no fix': 2 };

  rows.sort((a, b) => {
    const fixDiff = fixOrder[a.fixType] - fixOrder[b.fixType];
    if (fixDiff !== 0) return fixDiff;
    const sevDiff = (sevOrder[a.severity] ?? 5) - (sevOrder[b.severity] ?? 5);
    if (sevDiff !== 0) return sevDiff;
    return a.name.localeCompare(b.name);
  });

  const red = (s) => \`\x1b[31m\${s}\x1b[0m\`;
  const yellow = (s) => \`\x1b[33m\${s}\x1b[0m\`;
  const green = (s) => \`\x1b[32m\${s}\x1b[0m\`;
  const cyan = (s) => \`\x1b[36m\${s}\x1b[0m\`;
  const magenta = (s) => \`\x1b[35m\${s}\x1b[0m\`;
  const bold = (s) => \`\x1b[1m\${s}\x1b[0m\`;
  const dim = (s) => \`\x1b[2m\${s}\x1b[0m\`;

  const colorSev = (s) =>
    ({
      critical: red(s),
      high: red(s),
      moderate: yellow(s),
      low: cyan(s),
      info: dim(s),
    }[s] || s);

  const colorFix = (f) =>
    ({
      'auto-fixable': green(f),
      'breaking fix': yellow(f),
      'no fix': red(f),
    }[f] || f);

  const cols = {
    name: Math.max(7, ...rows.map((r) => r.name.length)),
    severity: Math.max(8, ...rows.map((r) => r.severity.length)),
    fixType: Math.max(12, ...rows.map((r) => r.fixType.length)),
    via: Math.max(3, ...rows.map((r) => r.via.length)),
  };

  const pad = (s, n) => s + ' '.repeat(Math.max(0, n - s.length));

  // Print header per fix category
  let lastFixType = '';
  const counts = { 'auto-fixable': 0, 'breaking fix': 0, 'no fix': 0 };
  const sevCounts = { critical: 0, high: 0, moderate: 0, low: 0, info: 0 };

  for (const r of rows) {
    counts[r.fixType]++;
    sevCounts[r.severity] = (sevCounts[r.severity] || 0) + 1;
  }

  const header =
    bold(
      pad('Package', cols.name) +
        '  ' +
        pad('Severity', cols.severity) +
        '  ' +
        pad('Fix', cols.fixType) +
        '  ' +
        'Via',
    );
  const divider = dim('─'.repeat(cols.name + cols.severity + cols.fixType + cols.via + 8));

  console.log(header);
  console.log(divider);

  for (const r of rows) {
    if (r.fixType !== lastFixType && lastFixType !== '') {
      console.log(divider);
    }
    lastFixType = r.fixType;
    console.log(
      pad(r.name, cols.name) +
        '  ' +
        colorSev(pad(r.severity, cols.severity)) +
        '  ' +
        colorFix(pad(r.fixType, cols.fixType)) +
        '  ' +
        dim(r.via),
    );
  }

  console.log();
  console.log(
    \`\${rows.length} vulnerabilities: \` +
      \`\${red((sevCounts.critical || 0) + ' critical')}, \` +
      \`\${red((sevCounts.high || 0) + ' high')}, \` +
      \`\${yellow((sevCounts.moderate || 0) + ' moderate')}, \` +
      \`\${cyan((sevCounts.low || 0) + ' low')}\`,
  );
  console.log(
    \`\${green(counts['auto-fixable'] + ' auto-fixable')}  \` +
      \`\${yellow(counts['breaking fix'] + ' breaking fix')}  \` +
      \`\${red(counts['no fix'] + ' no fix')}\`,
  );
});
"
