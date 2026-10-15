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

  it("carries an inline card that satisfies the MCP server schema", async () => {
    const response = GET();
    const body = await response.json();

    const card = body.entries.find(
      (entry: { identifier: string }) =>
        entry.identifier === "urn:air:thenational.academy:mcp:curriculum",
    ).data;

    // Required by
    // https://static.modelcontextprotocol.io/schemas/2025-09-29/server.schema.json
    // A card missing any of these is rejected by a validating registry.
    // A card missing any of these is rejected by a validating registry.
    for (const field of ["name", "description", "version"]) {
      expect({ field, type: typeof card[field] }).toEqual({
        field,
        type: "string",
      });
      expect(card[field].length).toBeGreaterThan(0);
    }

    // `name` must be reverse-DNS with exactly one slash.
    expect(card.name.split("/")).toHaveLength(2);

    // Version ranges are rejected by the schema.
    expect(card.version).not.toMatch(/[\^~*]|>=|<=|\bx\b/);

    // The schema caps `description` at 100. The 195-character original was
    // silently non-conformant: nothing in this repo would have caught it.
    expect(card.description.length).toBeLessThanOrEqual(100);

    // An identifier, not a fetch target — but it must be the resolvable
    // published schema rather than the 404ing URL the reference cards use.
    expect(card.$schema).toBe(
      "https://static.modelcontextprotocol.io/schemas/2025-09-29/server.schema.json",
    );
  });

  it("keeps the two entries' representative queries disjoint", async () => {
    const response = GET();
    const body = await response.json();

    // Both entries land in one registry index. Shared query vocabulary makes
    // Oak's resources compete for the same search instead of each answering
    // the search it is right for — docs/agent-discovery.md.
    const [first, second] = body.entries.map(
      (entry: { representativeQueries: string[] }) =>
        new Set(
          entry.representativeQueries.flatMap((query) =>
            query.toLowerCase().match(/[a-z0-9']+/g),
          ),
        ),
    );

    const stopWords = new Set([
      "a",
      "an",
      "and",
      "for",
      "in",
      "into",
      "of",
      "the",
      "to",
      "does",
      "what",
      "which",
      "me",
      "my",
      "i",
      "it",
      "on",
      "across",
      "with",
      "from",
      "oak",
      "oak's",
      "curriculum",
      "lesson",
      "lessons",
      "unit",
      "units",
    ]);

    const shared = [...first].filter(
      (token) => second.has(token) && !stopWords.has(token),
    );

    // Named rather than counted, so a failure says which words collided.
    expect(shared).toEqual([]);
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
