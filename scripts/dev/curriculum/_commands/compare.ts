import { writeFile } from "fs/promises";
import { basename, join, relative } from "path";

import { glob } from "glob";
import { sortBy, uniq } from "lodash";
import open from "open";

// function formatPath(input: string) {
//   return `./${input}`;
// }

const removeFileExtension = (filename: string) =>
  filename.substring(0, filename.lastIndexOf(".")) || filename;

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
                  font-family: sans-serif;
                  font-size: 14px;
                }
                html, body {
                  margin: 0;
                  padding: 0;
                }
                *, *:before, *:after {
                  box-sizing: inherit;
                }
                .column-header{
                  background: #eeeeee;
                  padding: 8px;
                  position: sticky;
                  top: 8px;
                  z-index: 9999;
                  border-radius: 5px;
                }
                .nav-item{
                  margin:8px 0;
                  display:flex;
                }
                .nav-item a{
                  padding:4px;
                  border:1px solid #ccc; 
                  background:#f6f6f6;
                  border-radius:5px;
                  text-decoration:none;
                  text-wrap: nowrap;
                  color:#333;
                }
                .nav-item a:hover{
                  background:#e6e6e6;
                }
                .pill{
                  background:#333;
                  color:#fff;
                  padding:2px 4px;
                  border-radius:3px;
                }
                .image-holder{
                  position: relative;
                  overflow: hidden;
                }
                .diff-image{
                  position: absolute;
                  top: 0;
                  left: 0;
                  bottom: 0;
                  right: 0;
                  mix-blend-mode: difference;
                }
                .image-holder img{
                  width: 100%;
                }
            </style>
            <div style="display: flex;">
            <div style="width: fit-content;">
              <div style="
                position: sticky;
                top: 0;
                padding: 10px;
                height: 100vh;
                overflow-y: auto;
              ">
                ${allFiles
                  .map((filename) => {
                    return `<div class="nav-item"><a href="#${filename}">${removeFileExtension(
                      filename,
                    )}</a></div>`;
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
                ${allFiles
                  .map((filename) => {
                    let imageHtml = `
                        <span id="${filename}" style="grid-column: 1 / -1"></span>
                        <div class="column-header" >
                            <span class="pill">${basepathInput}</span> ${filename}
                        </div>
                        <div class="column-header">
                            <span class="pill">${targetpathInput}</span> ${filename}
                        </div>
                        <div class="column-header">
                            <span class="pill">diff</span> ${filename}
                        </div>
                    `;
                    if (baseFilesStub.includes(filename)) {
                      imageHtml += `<div class="image-holder"><img src="${relBasepath}/${filename}" /></div>`;
                    } else {
                      imageHtml += `<div style="background: #eee; padding: 8px;">Missing</div>`;
                    }
                    if (targetFilesStub.includes(filename)) {
                      imageHtml += `<div class="image-holder"><img src="${relTargetpath}/${filename}" /></div>`;
                    } else {
                      imageHtml += `<div style="background: #eee; padding: 8px;">Missing</div>`;
                    }

                    if (
                      baseFilesStub.includes(filename) &&
                      targetFilesStub.includes(filename)
                    ) {
                      imageHtml += `<div style="filter:invert(1)" class="image-holder">
                        <img src="${relBasepath}/${filename}" />
                        <div class="diff-image"><img src="${relTargetpath}/${filename}" /></div>
                      </div>`;
                    } else {
                      imageHtml += `<div style="background: #eee; padding: 8px;">Missing</div>`;
                    }

                    return imageHtml;
                  })
                  .join("")}
            </div>
            </div>
        </body>
    `;
  const outpath = join(outbasePath, `compare.html`);
  await writeFile(outpath, html);
  console.log(`📄 written to: ${outpath}`);
  await open(outpath);
}
