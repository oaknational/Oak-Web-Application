import { writeFile } from "fs/promises";
import { join } from "path";

import { sortBy, uniq } from "lodash";
import open from "open";

import {
  readJson,
  resolveInputPath,
  wrapHtmlLayout,
  removeFileExtension,
  renderComparison,
  ScreenshotResult,
  ScreenshotPageResult,
  ScreenshotModalResult,
} from "./helpers";

export default async function compare(
  basepathInput: string,
  targetpathInput: string,
) {
  const basepath = resolveInputPath(basepathInput);
  const targetpath = resolveInputPath(targetpathInput);

  const baseJson: ScreenshotResult = await readJson(
    join(basepath, "index.json"),
  );
  const targetJson: ScreenshotResult = await readJson(
    join(targetpath, "index.json"),
  );

  const includesModals = baseJson.includesModals ?? targetJson.includesModals;

  const outbasePath = process.cwd() + "/scripts/dev/curriculum/output/";

  const baseJsonBySlug: Record<string, ScreenshotPageResult> = {};
  const targetJsonBySlug: Record<string, ScreenshotPageResult> = {};
  for (const obj of baseJson.pages) {
    baseJsonBySlug[obj.slug] = obj;
  }
  for (const obj of targetJson.pages) {
    targetJsonBySlug[obj.slug] = obj;
  }

  const allSlugs = sortBy(
    uniq([...Object.keys(baseJsonBySlug), ...Object.keys(targetJsonBySlug)]),
  );

  if (includesModals) {
    for (const slug of allSlugs) {
      const baseModalJsonBySlug: Record<string, ScreenshotModalResult> = {};
      const targetModalJsonBySlug: Record<string, ScreenshotModalResult> = {};
      for (const obj of baseJsonBySlug[slug]!.modals) {
        baseModalJsonBySlug[obj.slug] = obj;
      }
      for (const obj of targetJsonBySlug[slug]!.modals) {
        targetModalJsonBySlug[obj.slug] = obj;
      }

      const modalSlugs = sortBy(
        uniq([
          ...Object.keys(baseModalJsonBySlug),
          ...Object.keys(targetModalJsonBySlug),
        ]),
      );

      const html = wrapHtmlLayout(`
        <div style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            padding: 0 8px;
            border-left: 1px solid #ccc;
        ">
          ${modalSlugs
            .map((modalSlug) => {
              return renderComparison(
                basepathInput,
                targetpathInput,
                baseModalJsonBySlug[modalSlug]!,
                targetModalJsonBySlug[modalSlug]!,
              );
            })
            .join("")}
        </div>
      `);
      await writeFile(outbasePath + `/${slug}.html`, html);
    }
  }

  const html = wrapHtmlLayout(`
    <div style="width: fit-content;">
      <div style="
        position: sticky;
        top: 0;
        padding: 10px;
        height: 100vh;
        overflow-y: auto;
      ">
        ${allSlugs
          .map((slug) => {
            return `<div class="nav-item">
              <a href="#${slug}">${removeFileExtension(slug)}
              ${includesModals ? `</a>&nbsp;—&nbsp;<a target="modals_${slug}" href="./${slug}.html">modals↗</a>` : ""}
            </div>`;
          })
          .join("")}
      </div>
    </div>
    <div style="
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        padding: 0 8px;
        border-left: 1px solid #ccc;
    ">
    ${allSlugs
      .map((slug) => {
        return renderComparison(
          basepathInput,
          targetpathInput,
          baseJsonBySlug[slug]!,
          targetJsonBySlug[slug]!,
        );
      })
      .join("")}
    </div>
  `);

  const outpath = join(outbasePath, `compare.html`);
  await writeFile(outpath, html);
  console.log(`📄 written to: ${outpath}`);
  await open(outpath);
}
