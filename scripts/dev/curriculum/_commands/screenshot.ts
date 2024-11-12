import { mkdir, unlink } from "fs/promises";
import { dirname, relative } from "path";

import { uniq } from "lodash";
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

const screenshotPageCurrent = async (
  page: Page,
  path: string,
  logOpts: { id: string },
  opts: { removeOptionsElement?: boolean },
) => {
  // Hack for testing new MV
  if (opts.removeOptionsElement) {
    await page.evaluate(() => {
      [...document.querySelectorAll('*[data-testid="options-tag"]')].forEach(
        (el) => el.remove(),
      );
    });
  }

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

  // TODO: Screenshot all the modals

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

const screenshotPage = async (
  page: Page,
  url: string,
  path: string,
  logOpts: { id: string },
  opts: { removeOptionsElement?: boolean },
) => {
  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  await page.evaluate(() => {
    document.querySelector("div[data-testid=cookie-banner]")?.remove();
  });

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
  const subjectAlternativesUniq = uniq(subjectAlternatives);
  const tierAlternativesUniq = uniq(tierAlternatives);

  type AltType = { subject?: string; tier?: string };
  const altList: AltType[] = [];

  // TODO: Should be simple "all combinations" function.
  if (subjectAlternativesUniq.length > 0) {
    for (const subjectAlternative of subjectAlternativesUniq) {
      if (tierAlternativesUniq.length > 0) {
        for (const tierAlternative of tierAlternativesUniq) {
          altList.push({ subject: subjectAlternative, tier: tierAlternative });
        }
      } else {
        altList.push({ subject: subjectAlternative });
      }
    }
  } else {
    if (tierAlternativesUniq.length > 0) {
      for (const tierAlternative of tierAlternativesUniq) {
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
      await screenshotPageCurrent(
        page,
        path.replace(/\.png/, "-" + buildFilenameSlug(alt) + ".png"),
        logOpts,
        opts,
      );
    }
  } else {
    await screenshotPageCurrent(page, path, logOpts, opts);
  }
};

async function screenshotUnitsPage(
  page: Page,
  slug: string,
  host: string,
  label: string | undefined,
  opts: { removeOptionsElement?: boolean },
) {
  const urlObj = new URL(host);

  const url = `${host}/teachers/curriculum/${slug}/units`;
  const finalLabel = label ?? slugify(urlObj.host);
  const screenshotPath = `${process.cwd()}/scripts/dev/curriculum/output/screenshots/${finalLabel}/${slug}.png`;
  await mkdir(dirname(screenshotPath), { recursive: true });
  await screenshotPage(page, url, screenshotPath, { id: slug }, opts);
}

async function loginWithUrl(page: Page, loginUrl: string) {
  await page.goto(loginUrl, {
    waitUntil: "networkidle0",
  });
}

export default async function screenshot(
  host: string,
  {
    loginUrl,
    label,
    removeOptionsElement,
  }: { loginUrl?: string; label?: string; removeOptionsElement?: true } = {},
) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--incognito"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });

  if (loginUrl) {
    await loginWithUrl(page, loginUrl);
  }

  const slugs = [
    "art-primary",
    "art-secondary",
    "citizenship-secondary-core",
    "citizenship-secondary-gcse",
    "computing-primary",
    "computing-secondary-core",
    "computing-secondary-aqa",
    "computing-secondary-ocr",
    "cooking-nutrition-primary",
    "cooking-nutrition-secondary",
    "design-technology-primary",
    "design-technology-secondary",
    "english-primary",
    "english-secondary-aqa",
    "english-secondary-edexcel",
    "english-secondary-eduqas",
    "french-primary",
    "french-secondary-aqa",
    "french-secondary-edexcel",
    "geography-primary",
    "geography-secondary-aqa",
    "geography-secondary-edexcelb",
    "german-secondary-aqa",
    "german-secondary-edexcel",
    "history-primary",
    "history-secondary-aqa",
    "history-secondary-edexcel",
    "maths-primary",
    "maths-secondary",
    "music-primary",
    "music-secondary-edexcel",
    "music-secondary-eduqas",
    "music-secondary-ocr",
    "physical-education-primary",
    "physical-education-secondary-core",
    "physical-education-secondary-aqa",
    "physical-education-secondary-edexcel",
    "physical-education-secondary-ocr",
    "religious-education-primary",
    "religious-education-secondary-gcse",
    "science-primary",
    "science-secondary-aqa",
    "science-secondary-edexcel",
    "science-secondary-ocr",
    "spanish-primary",
    "spanish-secondary-aqa",
    "spanish-secondary-edexcel",
  ];

  for (const slug of slugs) {
    await screenshotUnitsPage(page, slug, host, label ?? undefined, {
      removeOptionsElement,
    });
  }

  await browser.close();
}
