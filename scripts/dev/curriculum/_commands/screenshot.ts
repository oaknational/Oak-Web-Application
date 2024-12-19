import { mkdir, writeFile } from "fs/promises";
import { relative, join } from "path";

import { uniq } from "lodash";
import { Page, launch } from "puppeteer";
import slugify from "slugify";

import {
  screenshotPageCurrent,
  ScreenshotResult,
  ScreenshotPageResult,
  ScreenshotModalResult,
} from "./helpers";
import { CURRIC_SLUGS, BASE_PATH } from "./config";

const screenshotCurrentModals = async (
  label: string,
  slug: string,
  page: Page,
): Promise<ScreenshotModalResult[]> => {
  const modals: ScreenshotModalResult[] = [];

  const getModalSlug = (yearText: string, text: string) => {
    return (
      slugify(yearText.toLowerCase().replace(/:/g, "")) +
      "-" +
      slugify(text.toLowerCase().replace(/:/g, "").replace("Unit info", ""))
    );
  };

  const yearContainerEls = await page.$$(
    '*[data-testid="curriculum-visualiser"] > *[id]',
  );

  for (const yearContainerEl of yearContainerEls) {
    const yearText = await (await yearContainerEl.$(
      '*[data-testid="year-heading"]',
    ))!.evaluate((el) => {
      return el.textContent ?? "";
    });
    const els = await yearContainerEl.$$('*[data-testid="unit-card"]');
    for (const el of els) {
      await el.click();
      const text = await page.evaluate((el) => el.textContent ?? "", el);

      await page.waitForSelector('*[data-testid="sidebar-modal"]');
      const sidebarEl = await page.$('*[data-testid="sidebar-modal"]');
      if (sidebarEl) {
        // Open all the accordians
        const accordianButtonElements = await sidebarEl.$$(
          '*[data-testid="expand-accordian-button"]',
        );
        for (const accordianButtonElement of accordianButtonElements) {
          await accordianButtonElement.click();
        }

        const modalSlug = getModalSlug(yearText, text);

        const modalScreenshotDir = getModalPath(label, slug);
        await mkdir(modalScreenshotDir, { recursive: true });
        const modalScreenshotPath = join(
          modalScreenshotDir,
          modalSlug + ".png",
        );

        await sidebarEl.screenshot({
          path: modalScreenshotPath,
        });

        console.log(`🖼️  [${slug}/${modalSlug}] rendered`);

        modals.push({
          slug: modalSlug,
          screenshot: relative(BASE_PATH, modalScreenshotPath),
        });
        const closeEl = await page.$('*[data-testid="close-button"]');
        await closeEl?.click();
      } else {
        throw new Error("Missing sidebar");
      }
    }
  }

  return modals;
};

const screenshotPage = async (
  host: string,
  label: string,
  slug: string,
  page: Page,
  opts: { id: string; includeModals: boolean; removeOptions: boolean },
): Promise<ScreenshotPageResult[]> => {
  const url = `${host}/teachers/curriculum/${slug}/units`;
  const basedir = getPagePath(label);
  await mkdir(basedir, { recursive: true });

  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  await page.evaluate(() => {
    document.querySelector("div[data-testid=cookie-banner]")?.remove();
  });

  const removeUnitOptions = async () => {
    await page.evaluate(() => {
      for (const el of Array.from(
        document.querySelectorAll('div[data-testid="options-tag"]'),
      )) {
        el.remove();
      }
    });
  };

  const subjectSelector =
    '*[data-testid="subjectCategory-button"], *[data-testid="subject-button"]';
  const tierSelector = `*[data-testid="tier-button"]`;
  const subjectAlternatives = await page.evaluate((subjectSelector) => {
    return [...document.querySelectorAll(subjectSelector)].map(
      (el) => el.textContent ?? "",
    );
  }, subjectSelector);
  const tierAlternatives = await page.evaluate((tierSelector) => {
    return [...document.querySelectorAll(tierSelector)].map(
      (el) => el.textContent ?? "",
    );
  }, tierSelector);
  const uniqueSubjectAlternatives = uniq(subjectAlternatives);
  const uniqueTierAlternatives = uniq(tierAlternatives);

  type AltType = { subject?: string; tier?: string };
  const altList: AltType[] = [];

  // TODO: Should be simple "all combinations" function.
  if (uniqueSubjectAlternatives.length > 0) {
    for (const subjectAlternative of uniqueSubjectAlternatives) {
      if (uniqueTierAlternatives.length > 0) {
        for (const tierAlternative of uniqueTierAlternatives) {
          altList.push({ subject: subjectAlternative, tier: tierAlternative });
        }
      } else {
        altList.push({ subject: subjectAlternative });
      }
    }
  } else {
    if (uniqueTierAlternatives.length > 0) {
      for (const tierAlternative of uniqueTierAlternatives) {
        altList.push({ tier: tierAlternative });
      }
    }
  }

  const buildFilenameSlug = (slug: AltType) => {
    const output = [];
    if (slug.subject) {
      output.push(slugify(slug.subject.toLowerCase()));
    }
    if (slug.tier) {
      output.push(slugify(slug.tier.toLowerCase()));
    }
    return output.join("-") ?? "";
  };

  const outputJson = [];

  if (altList.length > 0) {
    for (const alt of altList) {
      for (const el of await page.$$(subjectSelector)) {
        if ((await page.evaluate((el) => el.textContent, el)) === alt.subject) {
          await el.click();
        }
      }
      for (const el of await page.$$(tierSelector)) {
        if ((await page.evaluate((el) => el.textContent, el)) === alt.tier) {
          await el.click();
        }
      }

      if (opts.removeOptions) {
        await removeUnitOptions();
      }

      const filenameSlug = buildFilenameSlug(alt);
      const pagePath = getPagePath(label, filenameSlug + ".png");
      await screenshotPageCurrent(page, pagePath);
      const combinedSlug = `${slug}-${filenameSlug}`;
      console.log(
        `📦 [${combinedSlug}] combined: ./${relative(process.cwd(), pagePath)}`,
      );
      const modals = !opts.includeModals
        ? []
        : await screenshotCurrentModals(label, combinedSlug, page);
      outputJson.push({
        slug: combinedSlug,
        screenshot: relative(BASE_PATH, pagePath),
        modals,
      });
    }
  } else {
    if (opts.removeOptions) {
      await removeUnitOptions();
    }

    const pagePath = getPagePath(label, `${slug}.png`);
    await screenshotPageCurrent(page, pagePath);
    console.log(
      `📦 [${slug}] combined: ./${relative(process.cwd(), pagePath)}`,
    );
    const modals = !opts.includeModals
      ? []
      : await screenshotCurrentModals(label, slug, page);
    outputJson.push({
      slug,
      screenshot: relative(BASE_PATH, pagePath),
      modals,
    });
  }
  return outputJson;
};

function getPagePath(label: string, subPath?: string) {
  const output = `${BASE_PATH}/screenshots/${label}`;
  return subPath ? join(output, subPath) : output;
}

function getModalPath(label: string, pageSlug: string) {
  return `${BASE_PATH}/screenshots/${label}/${pageSlug}/`;
}

async function loginWithUrl(page: Page, loginUrl: string) {
  await page.goto(loginUrl, {
    waitUntil: "networkidle0",
  });
}

async function withPage(callback: (page: Page) => Promise<void>) {
  const browser = await launch({
    headless: "new",
    args: ["--incognito"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 2800 });
  try {
    await callback(page);
  } catch (err) {
    console.error(err);
  }
  await browser.close();
}

type screenshotOpts = {
  loginUrl?: string;
  includeModals?: boolean;
  removeOptions?: boolean;
};
export default async function screenshot(
  host: string,
  label: string,
  {
    loginUrl,
    removeOptions = false,
    includeModals = false,
  }: screenshotOpts = {},
) {
  await withPage(async (page) => {
    if (loginUrl) {
      await loginWithUrl(page, loginUrl);
    }

    const outputJson: ScreenshotResult = {
      includesModals: includeModals,
      pages: [],
    };
    for (const slug of CURRIC_SLUGS) {
      const pageJson = await screenshotPage(host, label, slug, page, {
        includeModals: includeModals,
        removeOptions,
        id: slug,
      });
      outputJson.pages = outputJson.pages.concat(pageJson);
    }

    await writeFile(
      join(getPagePath(label, "index.json")),
      JSON.stringify(outputJson, null, 2),
    );
  });
}
