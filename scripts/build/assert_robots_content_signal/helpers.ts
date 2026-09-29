/**
 * MCP-714. Decides whether the robots.txt `next-sitemap` emitted actually
 * carries Oak's Content Signals declaration.
 *
 * Kept separate from `index.ts` so it can be unit tested without running the
 * build step. See `docs/content-signals.md`.
 */

export const ROBOTS_TXT_PATH = "public/robots.txt";

/** The opening line of the group the directive has to sit in. */
export const WILDCARD_USER_AGENT = "User-agent: *";

/**
 * Only the directive's presence and position are checked here. The values it
 * declares are asserted against the served file by
 * `src/tests/e2e/robots/content-signal.spec.ts`, which spells them out so that
 * an edit to `next-sitemap.config.js` cannot quietly move them. This step
 * guards emission; that test guards the values.
 */
export const DIRECTIVE_PREFIX = "Content-Signal:";

export type ContentSignalCheck =
  | { readonly ok: true; readonly directive: string }
  | { readonly ok: false; readonly fault: string };

/**
 * @param robotsTxt Contents of the emitted robots.txt, or `null` if no file was
 *   written at all.
 */
export function checkContentSignal(
  robotsTxt: string | null,
): ContentSignalCheck {
  if (robotsTxt === null) {
    return {
      ok: false,
      fault:
        `No ${ROBOTS_TXT_PATH} was emitted. next-sitemap writes robots.txt, the ` +
        `sitemaps and the sitemap index in one final step, so this build has ` +
        `produced none of them. next-sitemap exits 0 when it fails: look further ` +
        `up this log for a red "[next-sitemap]" line naming the cause.`,
    };
  }

  const lines = robotsTxt.split("\n").map((line) => line.trim());
  const groupIndex = lines.indexOf(WILDCARD_USER_AGENT);

  if (groupIndex === -1) {
    return {
      ok: false,
      fault:
        `${ROBOTS_TXT_PATH} was emitted but has no "${WILDCARD_USER_AGENT}" group, ` +
        `so the declaration has nowhere to go. Check robotsTxtOptions.policies in ` +
        `next-sitemap.config.js.`,
    };
  }

  const nextLine = lines[groupIndex + 1] ?? "";

  if (!nextLine.startsWith(DIRECTIVE_PREFIX)) {
    return {
      ok: false,
      fault:
        `${ROBOTS_TXT_PATH} has a "${WILDCARD_USER_AGENT}" group, but the line after ` +
        `it is ${JSON.stringify(nextLine)} rather than a "${DIRECTIVE_PREFIX}" ` +
        `directive. The transformRobotsTxt hook in next-sitemap.config.js did not ` +
        `inject it.`,
    };
  }

  return { ok: true, directive: nextLine };
}
