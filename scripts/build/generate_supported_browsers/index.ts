import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

async function main() {
  const { getUserAgentRegex } = await import("browserslist-useragent-regexp");

  const outputPath = resolve(
    process.cwd(),
    "src/common-lib/error-reporter/supportedBrowsersRegexp.ts",
  );

  const regexp = getUserAgentRegex({ allowHigherVersions: true });
  const contents = `// @generated — do not edit. Run: pnpm run generate-supported-browsers
export default ${regexp};
`;

  writeFileSync(outputPath, contents);
  console.log(`Wrote supported browsers regex to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
