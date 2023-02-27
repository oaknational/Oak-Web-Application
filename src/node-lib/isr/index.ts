import path from "node:path/posix";

import { GetServerSidePropsContext, GetStaticPropsResult } from "next";

import serverConfig from "../../config/server";

const disableIsr = serverConfig.get("disableIsr");
if (disableIsr) {
  console.info("ISR disabled in env");
}
// For now we can couple these settings,
// but keeping them semantically separate
// in case we want finer control later.
const shouldSkipInitialBuild = !disableIsr;

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

interface FallbackBlockingConfig {
  paths: ReadonlyArray<never>;
  fallback: "blocking";
}
/**
 * Generate config for getStaticPaths that disables the initial static build of a page.
 *
 * https://nextjs.org/docs/basic-features/data-fetching/get-static-paths#generating-paths-on-demand
 *
 * @returns The getStaticPaths config.
 */
function getFallbackBlockingConfig(): FallbackBlockingConfig {
  return {
    paths: [],
    fallback: "blocking",
  };
}

/**
 * A convenience function for when the page path is of the form
 * `some/path/[someSlug]`, not suitable for more complex dynamic
 * path structures.
 */
function getServerSideSitemapFields(
  context: GetServerSidePropsContext,
  sitemapBaseUrl: string,
  pagePath: string,
  pageSlugs: string[] | Set<string>
) {
  const fields = Array.from(pageSlugs).map((slug) => {
    return {
      loc: new URL(path.join(sitemapBaseUrl, pagePath, slug)).href,
      lastmod: new Date().toISOString(),
      // change frequency
      // priority
    };
  });
  return fields;
}

export {
  decorateWithIsr,
  getFallbackBlockingConfig,
  getServerSideSitemapFields,
  shouldSkipInitialBuild,
};
