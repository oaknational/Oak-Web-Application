import { mkdir } from "fs/promises";
import { dirname, relative } from "path";

import puppeteer, { Page } from "puppeteer";
import slugify from "slugify";

const screenshotPage = async (
  page: Page,
  url: string,
  path: string,
  logOpts: { id: string },
) => {
  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  await page.evaluate(() => {
    document.querySelector("div[data-testid=cookie-banner]")?.remove();
  });

  await page.screenshot({
    path: path,
    captureBeyondViewport: true,
    fullPage: true,
  });

  console.log(
    `📸 [${logOpts.id}] page captured: ./${relative(process.cwd(), path)}`,
  );
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
    waitUntil: "networkidle0",
  });
}

export default async function screenshot(
  host: string,
  { loginUrl, label }: { loginUrl?: string; label?: string } = {},
) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--incognito"],
  });
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
