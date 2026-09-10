/**
 * @jest-environment node
 */
import { GET } from "@/app/api/well-known/ard/route";

describe("/.well-known/ard.json", () => {
  it("responds 200 with the catalog content type and open CORS", async () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "application/ai-catalog+json",
    );
    // Without this the manifest is unreadable from a browser context.
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("returns entries that satisfy the ARD entry requirements", async () => {
    const response = GET();
    const body = await response.json();

    expect(Array.isArray(body.entries)).toBe(true);
    expect(body.entries.length).toBeGreaterThan(0);

    for (const entry of body.entries) {
      expect(entry.identifier).toMatch(
        /^urn:air:[a-zA-Z0-9.-]+(:[a-zA-Z0-9._-]+)+$/,
      );
      expect(typeof entry.displayName).toBe("string");
      expect(entry.displayName.length).toBeGreaterThan(0);
      expect(typeof entry.type).toBe("string");

      // Exclusive, not "has one of them": an entry carrying both is invalid.
      expect("url" in entry).not.toBe("data" in entry);

      // The signal a registry indexes on; without it the entry is unfindable.
      expect(entry.representativeQueries.length).toBeGreaterThanOrEqual(2);
      expect(entry.representativeQueries.length).toBeLessThanOrEqual(5);
    }
  });

  it("advertises the MCP server with an inline card naming the endpoint", async () => {
    const response = GET();
    const body = await response.json();

    const mcp = body.entries.find(
      (entry: { identifier: string }) =>
        entry.identifier === "urn:air:thenational.academy:mcp:curriculum",
    );

    expect(mcp).toBeDefined();
    expect(mcp.type).toBe("application/mcp-server-card+json");
    // No card URL by design — docs/agent-discovery.md.
    expect(mcp.url).toBeUndefined();
    expect(mcp.data.remotes[0].url).toBe("https://mcp.thenational.academy/mcp");
  });

  it("advertises the curriculum API by the catalogue the API itself hosts", async () => {
    const response = GET();
    const body = await response.json();

    const api = body.entries.find(
      (entry: { identifier: string }) =>
        entry.identifier === "urn:air:thenational.academy:api:curriculum",
    );

    expect(api).toBeDefined();
    expect(api.type).toContain("application/linkset+json");

    // Pinned to the API-hosted catalogue: www's copy omits `/api/bulk`, so
    // swapping the host here would silently narrow what Oak advertises.
    expect(api.url).toBe(
      "https://open-api.thenational.academy/.well-known/api-catalog",
    );
  });
});
