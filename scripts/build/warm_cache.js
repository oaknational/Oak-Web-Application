/* eslint-env node, es6 */

const fetch = require("node-fetch");

const getDeploymentTestUrls = require("../../src/common-lib/urls/getDeploymentTestUrls");

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

const relativeUrls = getDeploymentTestUrls();

const urls = relativeUrls.map((relUrl) => {
  try {
    return new URL(relUrl, baseUrl).href;
  } catch (e) {
    console.log({
      relUrl,
      baseUrl,
    });
    console.error(e);
    process.exit(1);
  }
});

let headers;
if (CfAccessClientId) {
  headers = {
    "CF-Access-Client-Id": CfAccessClientId,
    "CF-Access-Client-Secret": CfAccessClientSecret,
  };
}

async function makeRequests() {
  const eventualResults = [];
  // Fetch each URL asynchronously, with a delay between each request, and store the eventual results.
  for await (const url of urls) {
    eventualResults.push(
      fetch(url, {
        headers,
      }),
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return eventualResults;
}

async function waitForResults(
  /** @type {Promise<Response>[]} */ _eventualResults,
) {
  const results = await Promise.all(_eventualResults);
  console.log(
    results.map((response) => `${response.url}: ${response.status}\n`),
  );
}

async function main() {
  const eventualResults = await makeRequests();
  await waitForResults(eventualResults);
}

main();
