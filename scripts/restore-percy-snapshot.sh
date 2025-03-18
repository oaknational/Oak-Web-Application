#!/bin/bash

# Script to restore the percy.snapshot.list.cjs file
cat >percy.snapshot.list.cjs <<'EOL'
const getDeploymentTestUrls = require("./src/common-lib/urls/getDeploymentTestUrls.cjs");

/**
 * Generate a list of snapshot configs for use with `percy snapshot`
 * https://docs.percy.io/docs/percy-snapshot#configuration
 */

const baseUrl = process.env.PERCY_BASE_URL;
if (!baseUrl) {
  throw new TypeError("process.env.PERCY_BASE_URL must be defined");
}
console.log("Percy base url:", baseUrl);

// Support single string relative URLs, or objects with a `url` key.
// https://docs.percy.io/docs/percy-snapshot#configuration
// Make Percy wait for the Next app to load.

const snapshotRelativeUrls = getDeploymentTestUrls().map((url) => {
  /** @type {import('@percy/core/types/index').SnapshotOptions} */
  const snapshotConfig = {
    url,
    // Wait for the Next app to load.
    waitForSelector: `#__next:not(:has([data-testid="loading"]))`,
    // waitForTimeout: 3000,
  };
  return snapshotConfig;
});

const urls = snapshotRelativeUrls.map((relUrl) => {
  if (typeof relUrl === "string") {
    const url = new URL(relUrl, baseUrl).href;
    return { name: relUrl, url };
  } else {
    const url = new URL(relUrl.url, baseUrl).href;
    return {
      // Pass through any fancy config.
      ...relUrl,
      name: relUrl.url,
      url,
    };
  }
});

module.exports = urls;
EOL

echo "Restored percy.snapshot.list.cjs"
