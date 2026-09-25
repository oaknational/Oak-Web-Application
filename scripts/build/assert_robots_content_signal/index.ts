/**
 * MCP-714. Fails the build when the Content Signals declaration did not reach
 * the emitted robots.txt.
 *
 * next-sitemap cannot fail a build. `CLI.main` registers robots.txt, the
 * sitemaps and the sitemap index before writing any of them; `CLI.execute`
 * swallows every rejection into `.catch(Logger.error)`, which is a bare
 * `console.error`; and `bin/next-sitemap.mjs` calls `new CLI().execute()`
 * without awaiting the promise. A throw from the `transformRobotsTxt` hook in
 * `next-sitemap.config.js` therefore prints in red and exits 0, having written
 * no robots.txt and no sitemaps. `public/robots.txt` and `public/sitemap*.xml`
 * are both gitignored, so the deploy ships bare and nothing notices.
 *
 * This step runs after next-sitemap in `postbuild` and reads what actually
 * landed on disk, so it fails the way the hook cannot.
 *
 * See `docs/content-signals.md`.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { checkContentSignal, ROBOTS_TXT_PATH } from "./helpers";

function readRobotsTxt(path: string): string | null {
  try {
    return readFileSync(path, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function main(): void {
  const robotsTxtPath = resolve(process.cwd(), ROBOTS_TXT_PATH);
  const result = checkContentSignal(readRobotsTxt(robotsTxtPath));

  if (!result.ok) {
    throw new Error(
      `Oak's Content Signals declaration is missing from this build.\n\n` +
        `${result.fault}\n\n` +
        `Nothing else fails when this happens, which is why this check exists. ` +
        `See docs/content-signals.md.`,
    );
  }

  console.log(`${ROBOTS_TXT_PATH} declares "${result.directive}"`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
