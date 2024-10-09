import { mkdir, unlink } from "fs/promises";
import { dirname, relative } from "path";

import puppeteer, { Page } from "puppeteer";
import sharp from "sharp";
import slugify from "slugify";

type Image = {
  input: string;
  top: number;
  bottom: number;
  left: number;
};

const combineScreenshots = async (
  images: Image[],
  outputFileName: string,
  width: number,
) => {
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
};

const screenshotPage = async (
  page: Page,
  url: string,
  path: string,
  logOpts: { id: string },
) => {
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

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
    return;
  }

  for (let i = 0; i < images.length; i++) {
    const sectionPath = images[i]!.input;

    await page.evaluate(
      (scrollY: number) => window.scrollTo(0, scrollY),
      i * viewportHeight,
    );

    console.log(
      `📸 [${logOpts.id}] temp #${i + 1}: ${relative(
        process.cwd(),
        sectionPath,
      )}`,
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

  console.log(
    `📦 [${logOpts.id}] combined: ./${relative(process.cwd(), path)}`,
  );
  await combineScreenshots(images, path, viewportWidth);
  await Promise.all(images.map((img) => unlink(img.input)));
};

async function screenshotUnitsPage(
  page: Page,
  slug: string,
  host: string,
  label?: string,
) {
  const urlObj = new URL(host);

  const url = `${host}/teachers/curriculum/${slug}/units`;
  const finalLabel = label ?? slugify(urlObj.host);
  const screenshotPath = `${process.cwd()}/scripts/dev/curriculum/output/screenshots/${finalLabel}/${slug}.png`;
  await mkdir(dirname(screenshotPath), { recursive: true });
  await screenshotPage(page, url, screenshotPath, { id: slug });
}

async function loginWithUrl(page: Page, loginUrl: string) {
  await page.goto(loginUrl, {
    waitUntil: "domcontentloaded",
  });
}

export default async function screenshot(
  host: string,
  { loginUrl, label }: { loginUrl?: string; label?: string } = {},
) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });

  if (loginUrl) {
    await loginWithUrl(page, loginUrl);
  }

  const slugs = [
    "english-primary",
    "english-secondary-aqa",
    "english-secondary-edexcel",
    "english-secondary-eduqas",
    "science-primary",
    "science-secondary-aqa",
    "science-secondary-edexcel",
    "science-secondary-ocr",
    "music-secondary-edexcel",
    "music-secondary-eduqas",
    "music-secondary-ocr",
    "maths-primary",
    "maths-secondary",
    "history-primary",
    "history-secondary-aqa",
    "history-secondary-edexcel",
    "geography-primary",
  ];

  for (const slug of slugs) {
    await screenshotUnitsPage(page, slug, host, label);
  }

  await browser.close();
}
