import { GetStaticPropsResult } from "next";

import config from "../../config";

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
  const disableIsr = !config.get("disableIsr");
  if (!disableIsr) {
    results.revalidate = config.get("sanityRevalidateSeconds");
  }

  return results;
}

export { decorateWithIsr };
