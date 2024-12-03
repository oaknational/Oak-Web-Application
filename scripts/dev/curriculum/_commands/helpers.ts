import { readFile, unlink } from "fs/promises";
import { join } from "path";

import { Page } from "puppeteer";
import sharp from "sharp";

import { BASE_PATH } from "./config";

export type ScreenshotModalResult = {
  slug: string;
  screenshot: string;
};

export type ScreenshotPageResult = {
  slug: string;
  screenshot: string;
  modals: ScreenshotModalResult[];
};

export type ScreenshotResult = {
  pages: ScreenshotPageResult[];
  includesModals: boolean;
};

export function wrapHtmlLayout(content: string) {
  return `
      <html>
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
                align-items: center;
              }
              .nav-item a {
                text-wrap: nowrap;
                color:#333;
              }
              .nav-item a:hover{
                color: #777;
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
            ${content}
          </div>
        </body>
      </html>
    `;
}

export function resolveInputPath(input: string) {
  if (input.startsWith(":")) {
    const labelName = input.replace(/^:/, "");
    return join(BASE_PATH, "screenshots", labelName);
  } else {
    return input;
  }
}

export async function readJson(filepath: string) {
  return JSON.parse((await readFile(filepath)).toString());
}

export function removeFileExtension(filename: string) {
  return filename.substring(0, filename.lastIndexOf(".")) || filename;
}

type Comparison = {
  slug: string;
  screenshot: string;
};
export function renderComparison(
  baseLabel: string,
  targetLabel: string,
  before: Comparison | null,
  after: Comparison | null,
) {
  if (!before && !after) {
    throw new Error("Missing data, both comparison objects are empty");
  }
  const slug = before?.slug ?? after?.slug;

  let imageHtml = `
        <span id="${slug}" style="grid-column: 1 / -1"></span>
        <div class="column-header" >
            <span class="pill">${baseLabel}</span> ${slug}
        </div>
        <div class="column-header">
            <span class="pill">${targetLabel}</span> ${slug}
        </div>
        <div class="column-header">
            <span class="pill">diff</span> ${slug}
        </div>
    `;
  if (before?.screenshot) {
    imageHtml += `<div class="image-holder"><img src="${before.screenshot}" /></div>`;
  } else {
    imageHtml += `<div style="background: #eee; padding: 8px;">Missing</div>`;
  }
  if (after?.screenshot) {
    imageHtml += `<div class="image-holder"><img src="${after.screenshot}" /></div>`;
  } else {
    imageHtml += `<div style="background: #eee; padding: 8px;">Missing</div>`;
  }

  if (before?.screenshot && after?.screenshot) {
    imageHtml += `<div style="filter:invert(1)" class="image-holder">
        <img src="${before.screenshot}" />
        <div class="diff-image"><img src="${after.screenshot}" /></div>
        </div>`;
  } else {
    imageHtml += `<div style="background: #eee; padding: 8px;">Missing</div>`;
  }

  return imageHtml;
}

export type Image = {
  input: string;
  top: number;
  bottom: number;
  left: number;
};

export async function combineScreenshots(
  images: Image[],
  outputFileName: string,
  width: number,
) {
  if (images.length > 0) {
    const totalHeight = images[images.length - 1]!.bottom;

    await sharp({
      create: {
        width: width,
        height: totalHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(images)
      .toFile(outputFileName);
  }
}

export async function screenshotPageCurrent(page: Page, path: string) {
  const viewportHeight = await page.evaluate(() => {
    return window.innerHeight;
  });
  const viewportWidth = await page.evaluate(() => {
    return window.innerWidth;
  });
  const totalHeight = await page.evaluate(() => {
    return document.body.scrollHeight;
  });
  const sections = Math.ceil(totalHeight / viewportHeight);

  let imgHeight = 0;
  const images: Image[] = [];
  for (let i = 0; i < sections; i++) {
    const sectionPath = `${path}_part${i + 1}.png`;

    const def = {
      input: sectionPath,
      top: imgHeight,
      bottom: Math.min(totalHeight, imgHeight + viewportHeight),
      left: 0,
    };

    images.push(def);
    imgHeight = def.bottom;
  }

  if (images.length < 1) {
    throw new Error("Something went wrong, no images generated");
  }

  for (let i = 0; i < images.length; i++) {
    const sectionPath = images[i]!.input;

    await page.evaluate(
      (scrollY: number) => window.scrollTo(0, scrollY),
      i * viewportHeight,
    );

    await page.screenshot({
      path: sectionPath,
      clip: {
        x: 0,
        y: i * viewportHeight,
        width: viewportWidth,
        height: Math.min(viewportHeight, totalHeight - i * viewportHeight),
      },
    });
  }
  await combineScreenshots(images, path, viewportWidth);
  await Promise.all(images.map((img) => unlink(img.input)));
}
