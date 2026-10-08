/**
 * Converts a lesson guide to an accessible HTML file, to check the output
 * before it's served from the site.
 *
 *   pnpm tsx scripts/dev/lesson-guide-html/index.ts guide.docx [guide.html] [--title "Lesson title"]
 *
 * Takes a .docx, or a bare word/document.xml (links and images need the .docx).
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";

import {
  lessonGuideDocxToHtml,
  lessonGuideXmlToHtml,
  renderStandaloneHtml,
} from "../../../src/pages-helpers/lesson-guide-html";

async function main() {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: { title: { type: "string" } },
  });
  const [input, output] = positionals;
  if (!input) {
    console.error(
      'Usage: pnpm tsx scripts/dev/lesson-guide-html/index.ts <guide.docx|document.xml> [output.html] [--title "Lesson title"]',
    );
    process.exit(1);
  }

  const data = await readFile(input);
  const { html, warnings } = /\.docx$/i.test(input)
    ? await lessonGuideDocxToHtml(data)
    : lessonGuideXmlToHtml({ documentXml: data.toString("utf8") });

  const name = path.basename(input).replace(/\.(docx|xml)$/i, "");
  const outputPath = output ?? path.join(path.dirname(input), `${name}.html`);
  await writeFile(
    outputPath,
    renderStandaloneHtml({ title: values.title ?? name, bodyHtml: html }),
  );

  console.log(`Wrote ${outputPath}`);
  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} things to check in the guide:`);
    for (const warning of warnings) console.warn(`- ${warning}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
