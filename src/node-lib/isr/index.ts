import { GetStaticPropsResult } from "next";

import config from "../../config";

const disableIsr = config.get("disableIsr");
if (disableIsr) {
  console.info("ISR disabled in env");
}

/**
 * Default add incremental static regeneration config to the getStaticProps result.
 * Can be disabled by setting the env `DISABLE_ISR="on"`.
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
    results.revalidate = revalidateTimeInSeconds;
  }

  return results;
}

export { decorateWithIsr };
