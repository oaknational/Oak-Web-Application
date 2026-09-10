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

    // Position, not just presence: a directive after a later `User-agent:` line
    // is addressed to a different agent, and a presence check would pass on it.
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
