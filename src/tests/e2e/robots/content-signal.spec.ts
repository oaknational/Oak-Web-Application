import { expect, test } from "@playwright/test";

/**
 * Oak's Content Signals declaration must be served in robots.txt.
 *
 * MCP-714. The directive is injected by `transformRobotsTxt` in
 * `next-sitemap.config.js`, because next-sitemap's robots builder emits only
 * Allow, Disallow and Crawl-delay. That makes the published directive the
 * product of a string transform over generated output — so it can be lost by a
 * change to the policies config, a next-sitemap upgrade, or a change to the
 * generated group header, none of which would fail a build.
 *
 * The declaration is a machine-readable statement of Oak's position on AI
 * training and search, addressed to crawlers. Its absence is silent.
 */

/**
 * The exact directive, spelled out rather than imported from the config.
 *
 * Deliberate: a test that read the value from the source it guards would follow
 * an accidental edit and stay green. The values are a ruled position, so a
 * change to them should make this spec go red and require a human to re-decide.
 */
const EXPECTED_DIRECTIVE =
  "Content-Signal: ai-train=no, search=yes, ai-input=no";

const AUTHORISATION_NOTICE =
  "These values were decided by Aakash and relayed by MG on 2026-09-10. Do NOT edit this " +
  "expectation to match the served file. If the served value has changed, either the " +
  "injection in `next-sitemap.config.js` has broken, or someone has changed a published " +
  "declaration about AI training rights — both need a human, not a test edit.";

test.describe("robots.txt Content Signals", () => {
  test("declares Oak's content signals inside the wildcard user-agent group", async ({
    request,
  }) => {
    const response = await request.get("/robots.txt", { maxRedirects: 0 });

    expect(
      response.status(),
      `robots.txt did not return 200. ${AUTHORISATION_NOTICE}`,
    ).toBe(200);

    const lines = (await response.text())
      .split("\n")
      .map((line) => line.trim());

    const userAgentIndex = lines.indexOf("User-agent: *");
    expect(
      userAgentIndex,
      "robots.txt has no 'User-agent: *' group, so any Content-Signal directive in it " +
        "applies to nothing.",
    ).toBeGreaterThan(-1);

    const directiveIndex = lines.indexOf(EXPECTED_DIRECTIVE);
    expect(
      directiveIndex,
      `robots.txt does not carry the expected directive. ${AUTHORISATION_NOTICE}`,
    ).toBeGreaterThan(-1);

    // A directive outside the group, or after a later `User-agent:` line, is
    // addressed to a different agent or to none. Asserting mere presence would
    // pass in both cases, which is why the position is checked and not just the
    // string.
    const groupEndIndex = lines.findIndex(
      (line, index) => index > userAgentIndex && line.startsWith("User-agent:"),
    );
    const groupEnd = groupEndIndex === -1 ? lines.length : groupEndIndex;

    expect(
      directiveIndex > userAgentIndex && directiveIndex < groupEnd,
      "The Content-Signal directive is served, but outside the 'User-agent: *' group, so " +
        "it does not apply to the crawlers it is meant for.",
    ).toBe(true);
  });
});
