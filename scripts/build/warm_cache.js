/* eslint-env node, es6 */

const fetch = require("node-fetch");

const baseUrl = process.env.BASE_URL;
if (!baseUrl) {
  throw new TypeError("Please define env BASE_URL");
}
// Optional CF Access headers.
const CfAccessClientId = process.env.CF_ACCESS_CLIENT_ID;
const CfAccessClientSecret = process.env.CF_ACCESS_CLIENT_SECRET;
if (CfAccessClientId && !CfAccessClientSecret) {
  throw new TypeError(
    `Please define envs for both CF_ACCESS_CLIENT_ID and CF_ACCESS_CLIENT_SECRET`
  );
}

const relativeUrls = [
  "/",
  "/lesson-planning",
  "/develop-your-curriculum",
  "/about-us/who-we-are",
  "/about-us/leadership",
  "/about-us/board",
  "/about-us/partners",
  "/about-us/work-with-us",
  "/blog",
  "/blog/how-to-design-a-unit-of-study",
  "/blog/evolution-of-oak",
  "/blog/join-the-childrens-mental-health-week-assembly-2022",
  "/legal/accessibility-statement",
  "/lp/download-our-lesson-and-resource-directory",
];

const urls = relativeUrls.map((relUrl) => new URL(relUrl, baseUrl).href);

let headers;
if (CfAccessClientId) {
  headers = {
    "CF-Access-Client-Id": CfAccessClientId,
    "CF-Access-Client-Secret": CfAccessClientSecret,
  };
}
const eventualResults = urls.map((url) => fetch(url, { headers }));

async function waitForResults(
  /** @type {Promise<Response>[]} */ _eventualResults
) {
  const results = await Promise.all(_eventualResults);
  console.log(
    "responses ok: ",
    results.map((response) => response.ok)
  );
}

waitForResults(eventualResults);
