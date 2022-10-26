import { GetStaticPropsResult } from "next";

import serverConfig from "../../config/server";

const disableIsr = serverConfig.get("disableIsr");
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
  const decoratedResults = { ...results };
  if (!disableIsr) {
    const revalidateTimeInSeconds = serverConfig.get("sanityRevalidateSeconds");
    decoratedResults.revalidate = revalidateTimeInSeconds;
  }

  return decoratedResults;
}

export { decorateWithIsr };
