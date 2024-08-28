import { writeFile } from "fs/promises";
import { basename, join, relative } from "path";

import { glob } from "glob";
import { sortBy, uniq } from "lodash";
import open from "open";

function formatPath(input: string) {
  return `./${input}`;
}

function outputPathFromLabel(label: string) {
  const labelName = label.replace(/^:/, "");
  return `${process.cwd()}/scripts/dev/curriculum/output/screenshots/${labelName}/`;
}

export default async function compare(
  basepathInput: string,
  targetpathInput: string,
) {
  const basepath = basepathInput.startsWith(":")
    ? outputPathFromLabel(basepathInput)
    : basepathInput;
  const targetpath = targetpathInput.startsWith(":")
    ? outputPathFromLabel(targetpathInput)
    : targetpathInput;
  const baseFiles = await glob(`${basepath}/*.png`);
  const targetFiles = await glob(`${targetpath}/*.png`);

  const outbasePath = process.cwd() + "/scripts/dev/curriculum/output/";
  const relBasepath = relative(outbasePath, basepath);
  const relTargetpath = relative(outbasePath, targetpath);

  const baseFilesStub = baseFiles.map((f) => basename(f));
  const targetFilesStub = targetFiles.map((f) => basename(f));
  const allFiles = sortBy(uniq([...baseFilesStub, ...targetFilesStub]));
  const html = `
        <body>
            <style>
                html {
                    box-sizing: border-box;
                }
                *, *:before, *:after {
                    box-sizing: inherit;
                }
            </style>
            <div style="
                display: grid;
                grid-template-columns: 50% 50%;
                gap: 8px;
                position: sticky;
                top: 0;
                z-index: 99;
            ">
                <div style="
                    background: #222222;
                    color: #ffffff;
                    padding: 8px;
                ">${formatPath(relBasepath)}/*</div>
                <div style="
                    background: #222222;
                    color: #ffffff;
                    padding: 8px;
                ">${formatPath(relTargetpath)}/*</div>
            </div>
            <div style="
                display: grid;
                grid-template-columns: 50% 50%;
                gap: 8px;
            ">
                ${allFiles
                  .map((filename) => {
                    let imageHtml = `
                        <div style="background: #eeeeee; padding: 8px; position: sticky; top: 0; z-index: 9999;">
                            ${formatPath(`${relBasepath}/${filename}`)}
                        </div>
                        <div style="background: #eeeeee; padding: 8px; position: sticky; top: 0; z-index: 9999;">
                            ${formatPath(`${relTargetpath}/${filename}`)}
                        </div>
                    `;
                    if (baseFilesStub.includes(filename)) {
                      imageHtml += `<div style="position: relative; overflow: hidden;"><img width="100%" src="${relBasepath}/${filename}" /></div>`;
                    } else {
                      imageHtml += `<div style="background: #eee; padding: 8px;">Missing</div>`;
                    }
                    if (targetFilesStub.includes(filename)) {
                      imageHtml += `<div style="position: relative; overflow: hidden;"><img width="100%" src="${relTargetpath}/${filename}" /></div>`;
                    } else {
                      imageHtml += `<div style="background: #eee; padding: 8px;">Missing</div>`;
                    }
                    return imageHtml;
                  })
                  .join("")}
            </div>
        </body>
    `;
  const outpath = join(outbasePath, `compare.html`);
  await writeFile(outpath, html);
  console.log(`📄 written to: ${outpath}`);
  await open(outpath);
}
