import { getCspHeaders } from "./cspHeaders";

jest.mock("../../scripts/build/build_config_helpers", () => ({
  getReleaseStage: () => ["production"],
}));

describe("CSP response headers", () => {
  it("emits one complete CSP header for global routes", () => {
    const headers = getCspHeaders();
    const cspHeaders = headers.filter(
      (header) => header.key.toLowerCase() === "content-security-policy",
    );

    expect(cspHeaders).toHaveLength(1);
    expect(cspHeaders[0]?.value).toContain(
      "frame-ancestors 'self' https://classroom.google.com",
    );
    expect(cspHeaders[0]?.value).toContain("img-src");
  });
});
