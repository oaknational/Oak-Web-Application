/* eslint-env node, es6 */

const puppeteer = require("puppeteer");

const getDeploymentTestUrls = require("../../src/common-lib/urls/getDeploymentTestUrls.cjs");

const baseUrl = process.env.BASE_URL;
if (!baseUrl) {
  throw new TypeError("Please define env BASE_URL");
}
// Optional CF Access headers.
const CfAccessClientId = process.env.CF_ACCESS_CLIENT_ID;
const CfAccessClientSecret = process.env.CF_ACCESS_CLIENT_SECRET;
if (CfAccessClientId && !CfAccessClientSecret) {
  throw new TypeError(
    `Please define envs for both CF_ACCESS_CLIENT_ID and CF_ACCESS_CLIENT_SECRET`,
  );
}

const relativeUrls = getDeploymentTestUrls().map((url) => {
  return {
    url,
    waitForSelector: "#__next",
  };
});

// Parse URLs to make sure they're valid.
const urls = relativeUrls.map((relUrl) => {
  try {
    // Simple URL
    if (typeof relUrl === "string") {
      return new URL(relUrl, baseUrl).href;
      // URL object with config
    } else {
      const url = new URL(relUrl.url, baseUrl).href;
      return {
        ...relUrl,
        url,
      };
    }
  } catch (e) {
    console.log({
      relUrl,
      baseUrl,
    });
    console.error(e);
    process.exit(1);
  }
});

// Optional CF Access headers.
let headers;
if (CfAccessClientId) {
  headers = {
    "CF-Access-Client-Id": CfAccessClientId,
    "CF-Access-Client-Secret": CfAccessClientSecret,
  };
}

async function loadPage(page, url, waitForSelector) {
  await page.goto(url, { timeout: 60000, waitUntil: "networkidle0" });
  // Optionally wait for a selector to be visible.
  if (waitForSelector) {
    console.log(`Waiting for selector ${waitForSelector}`);
    await page.waitForSelector(waitForSelector);
  }
}

async function main() {
  const browser = await puppeteer.launch({ headless: "new" });
  const ua = await browser.userAgent();
  const page = await browser.newPage();
  page.setUserAgent(`oak testing ${ua}`);
  if (headers) {
    page.setExtraHTTPHeaders(headers);
  }
  page.setViewport({
    width: 1920,
    height: 1080,
  });

  const urlTotal = urls.length;
  let urlCount = 0;
  const errors = [];
  for await (const urlStringOrObject of urls) {
    let url;
    let waitForSelector;
    if (typeof urlStringOrObject === "string") {
      url = urlStringOrObject;
    } else {
      url = urlStringOrObject.url;
      waitForSelector = urlStringOrObject.waitForSelector;
    }
    urlCount++;
    try {
      console.log(`(${urlCount} of ${urlTotal}) Warming cache for ${url}`);
      console.time(url);
      try {
        await loadPage(page, url, waitForSelector);
      } catch (e) {
        // Retry once
        console.warn(
          `Encountered error warming cache for ${url} with following error, retrying once`,
        );
        console.warn(e);
        await loadPage(page, url, waitForSelector);
      }
      console.timeEnd(url);
    } catch (e) {
      errors.push({ url, e });
      console.error(`Problem warming cache for ${url}`);
      console.error(e);
    }
  }
  if (errors.length) {
    console.error("Encountered errors warming cache for the following URLs");
    console.error(errors.map(({ url }) => url));
    process.exit(1);
  }
  await browser.close();
}

main();
