import { expect, test } from "@playwright/test";

/**
 * MCP-714. The directive is a string transform over next-sitemap's generated
 * output, so a policies change or a next-sitemap upgrade can drop it without
 * failing a build. Its absence is otherwise silent.
 *
 * See `docs/content-signals.md`.
 */

/** Spelled out, not imported: a test reading its own source cannot catch an edit to it. */
const EXPECTED_DIRECTIVE =
  "Content-Signal: ai-train=no, search=yes, ai-input=no";

const AUTHORISATION_NOTICE =
  "Do NOT edit this expectation to match the served file. Either the injection in " +
  "`next-sitemap.config.js` has broken, or a published declaration about AI training " +
  "rights has changed. Both need a human — see `docs/content-signals.md`.";

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

    // Exact position, not "somewhere after". `next-sitemap.config.js` injects the
    // directive on the line immediately below the group's opening line, so that is
    // what gets asserted. A group-bounded check passes on any placement at all
    // while this file has only one `User-agent:` line in it.
    expect(
      directiveIndex,
      "The Content-Signal directive is served, but not on the line immediately after " +
        "'User-agent: *', where next-sitemap.config.js injects it. Check it is still " +
        "inside the wildcard group rather than addressed to a different agent, and " +
        "move this expectation only if the injection point moved deliberately.",
    ).toBe(userAgentIndex + 1);
  });
});
