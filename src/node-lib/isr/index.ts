import { GetStaticPropsResult } from "next";

import config from "../../config";

const disableIsr = config.get("disableIsr");

/**
 * Conditionally add incremental static regeneration config to the getStaticProps result.
 *
 * Modifies the original object, lazy but simple.
 *
 * @param results Input GetStaticProps results.
 * @returns The modified results.
 */
function decorateWithIsr<P>(
  results: GetStaticPropsResult<P>
): GetStaticPropsResult<P> {
  if (!disableIsr) {
    const revalidateTimeInSeconds = config.get("sanityRevalidateSeconds");

    // DEBUG
    console.log("revalidateTimeInSeconds", revalidateTimeInSeconds);

    results.revalidate = revalidateTimeInSeconds;
  }

  return results;
}

export { decorateWithIsr };
