import {
  checkContentSignal,
  DIRECTIVE_PREFIX,
  ROBOTS_TXT_PATH,
} from "./helpers";

const DIRECTIVE = `${DIRECTIVE_PREFIX} ai-train=no, search=yes, ai-input=no`;

const emitted = (...lines: string[]) => `${lines.join("\n")}\n`;

describe("checkContentSignal", () => {
  test("accepts a robots.txt carrying the directive under the wildcard group", () => {
    const result = checkContentSignal(
      emitted(
        "# *",
        "User-agent: *",
        DIRECTIVE,
        "Disallow: /api",
        "",
        "Host: https://www.thenational.academy",
      ),
    );

    expect(result).toEqual({ ok: true, directive: DIRECTIVE });
  });

  test("rejects a build that emitted no robots.txt at all", () => {
    const result = checkContentSignal(null);

    expect(result.ok).toBe(false);
    expect(result.ok ? "" : result.fault).toContain(ROBOTS_TXT_PATH);
  });

  test("rejects a robots.txt with no wildcard user-agent group", () => {
    const result = checkContentSignal(
      emitted("User-agent: Googlebot", DIRECTIVE, "Disallow: /api"),
    );

    expect(result.ok).toBe(false);
    expect(result.ok ? "" : result.fault).toContain("User-agent: *");
  });

  test("rejects a directive that is present but not directly under the group", () => {
    const result = checkContentSignal(
      emitted("User-agent: *", "Disallow: /api", DIRECTIVE),
    );

    expect(result.ok).toBe(false);
    expect(result.ok ? "" : result.fault).toContain("Disallow: /api");
  });

  test("rejects a wildcard group that is the last line of the file", () => {
    const result = checkContentSignal(emitted("User-agent: *"));

    expect(result.ok).toBe(false);
  });

  test("rejects an empty file", () => {
    const result = checkContentSignal("");

    expect(result.ok).toBe(false);
  });
});
