/**
 * @jest-environment node
 */
import { GET } from "@/app/api/well-known/api-catalog/route";

describe("/.well-known/api-catalog", () => {
  it("responds 200 with the RFC 9727 linkset+json content type", async () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
    );
  });

  it("returns a linkset array whose entries carry an anchor and link relations", async () => {
    const response = GET();
    const body = await response.json();

    expect(Array.isArray(body.linkset)).toBe(true);
    expect(body.linkset.length).toBeGreaterThan(0);

    for (const entry of body.linkset) {
      expect(typeof entry.anchor).toBe("string");
      expect(entry.anchor).toMatch(/^https:\/\//);

      // Each documented relation is an array of { href, ... } link objects.
      for (const relation of ["service-desc", "service-doc", "status"]) {
        expect(Array.isArray(entry[relation])).toBe(true);
        for (const link of entry[relation]) {
          expect(link.href).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it("advertises the Oak Curriculum Open API with its docs and health endpoints", async () => {
    const response = GET();
    const body = await response.json();

    const openApi = body.linkset.find(
      (entry: { anchor: string }) =>
        entry.anchor === "https://open-api.thenational.academy",
    );

    expect(openApi).toBeDefined();
    expect(openApi["service-desc"][0].href).toBe(
      "https://open-api.thenational.academy/api/v0/swagger.json",
    );
    expect(openApi["service-doc"][0].href).toBe(
      "https://open-api.thenational.academy/docs",
    );
    expect(openApi.status[0].href).toBe(
      "https://open-api.thenational.academy/api/health",
    );
  });
});
