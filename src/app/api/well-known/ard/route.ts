/**
 * Agentic Resource Discovery (ARD) manifest.
 *
 * Advertises Oak's agent-usable resources so a discovery agent can find them
 * from the apex domain without being told where to look.
 *
 * Served at `/.well-known/ard.json` AND `/.well-known/ai-catalog.json` via
 * rewrites in `next.config.ts` (App Router does not route folders that start
 * with a dot).
 *
 * - ARD specification v0.91 (status: Proposal, 2026-08-26)
 *   https://agenticresourcediscovery.org/spec/
 * - Entry schema and the official conformance CLI
 *   https://github.com/ards-project/ard-spec
 */

/**
 * Both paths are served deliberately.
 *
 * Spec §5.1 says a publisher need only serve `ard.json`, and that consumers
 * MUST fetch it. Measured 2026-09-09, though, every publisher the spec cites as
 * a reference is on the predecessor path ONLY — github.com, huggingface.co and
 * developers.cloudflare.com all return 200 for `ai-catalog.json` and 404/401
 * for `ard.json`. The spec is the newer thing; deployed consumers are not.
 *
 * Serving both costs one rewrite and makes Oak findable by consumers written
 * against either revision. Do not "simplify" this to one path.
 */
const ARD_CONTENT_TYPE = "application/ai-catalog+json";

/**
 * The MCP server description, inline.
 *
 * There is deliberately NO server card URL here. Measured 2026-09-09:
 *
 * - The MCP working group's own discovery document lists all three
 *   `.well-known` server-card paths under "Alternatives considered … not
 *   recommended", so publishing one there would adopt a rejected placement.
 * - The reserved location is `<streamable-http-url>/server-card`. Oak does not
 *   serve it: `https://mcp.thenational.academy/mcp/server-card` answers 406
 *   `{"error":"Accept header must include text/event-stream"}` for every Accept
 *   header including `*\/*`, which is the streamable-HTTP transport catching
 *   the path — not a card route.
 *
 * So the entry names the MCP endpoint itself, carried inline via `data`. Spec
 * §4.3 allows exactly one of `url` or `data`, and `data` is the only one that
 * can name the endpoint truthfully: a `url` of the same media type would have
 * to dereference to a card document, and no such document exists.
 *
 * Field set mirrors the live cards published by github.com and huggingface.co.
 * `$schema` is omitted because both of those point at
 * `static.modelcontextprotocol.io/schemas/v1/server-card.schema.json`, which
 * returns 404. `version` is omitted because this server does not publish one,
 * and inventing it would be fabricated metadata.
 */
const mcpServerCard = {
  name: "thenational.academy/mcp",
  title: "Oak Curriculum",
  description:
    "Connects an AI assistant to Oak National Academy's free, fully sequenced, openly licensed curriculum for schools in England — lessons, units and teaching resources across subjects and key stages.",
  websiteUrl: "https://mcp.thenational.academy/",
  remotes: [
    {
      type: "streamable-http",
      url: "https://mcp.thenational.academy/mcp",
    },
  ],
} as const;

/**
 * The manifest served at both paths.
 *
 * `specVersion` and `host` are transport-defined members that ARD ignores
 * (§5.1); they are included because all three reference publishers emit them.
 * ARD itself requires only `entries`.
 *
 * Each entry carries `identifier`, `displayName` and `type` (MUST, §4.2),
 * exactly one of `url`/`data` (§4.3), and 2-5 `representativeQueries` (SHOULD,
 * §4.2) — the queries are the signal a registry builds its semantic index
 * from, and an entry without them cannot be found by search.
 */
const ardManifest = {
  specVersion: "1.0",
  host: {
    displayName: "Oak National Academy",
    identifier: "thenational.academy",
    documentationUrl: "https://www.thenational.academy/",
  },
  entries: [
    {
      identifier: "urn:air:thenational.academy:mcp:curriculum",
      displayName: "Oak Curriculum MCP Server",
      type: "application/mcp-server-card+json",
      data: mcpServerCard,
      description:
        "MCP server giving an AI assistant direct access to Oak's curriculum: search lessons and units, follow progression across year groups, and retrieve teaching resources. Requires OAuth 2.1 sign-in with a free Oak account.",
      tags: ["oak", "curriculum", "education", "mcp", "teaching"],
      representativeQueries: [
        "find me a key stage 3 science lesson on photosynthesis",
        "what does the year 4 maths curriculum cover on fractions",
        "how does the Norman conquest build across key stage 3 history",
        "I need a worksheet and slides for a lesson on the water cycle",
      ],
    },
    {
      identifier: "urn:air:thenational.academy:api:curriculum",
      displayName: "Oak Curriculum Open API",
      // The RFC 9727 catalogue hosted BY the API, not the copy on www.
      // Measured 2026-09-09, the two disagree: this one carries both
      // `/api/v0` and `/api/bulk`, while www's lists only the v0 host. The
      // drift is tracked as MCP-721 and is not fixed here. Pointing at the
      // catalogue rather than a single OpenAPI document also means this entry
      // stays true as Oak's API surface grows.
      type: 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
      url: "https://open-api.thenational.academy/.well-known/api-catalog",
      description:
        "Catalogue of Oak's public curriculum REST API — the versioned lesson and unit endpoints and the bulk download surface, with their OpenAPI descriptions, documentation and playground. Curriculum content is published under the Open Government Licence.",
      tags: ["oak", "curriculum", "education", "api", "openapi"],
      representativeQueries: [
        "what lessons does Oak have for year 5 maths",
        "which subjects and key stages does Oak's curriculum cover",
        "get Oak's curriculum data for a whole subject and key stage",
      ],
    },
  ],
} as const;

export function GET() {
  return new Response(JSON.stringify(ardManifest, null, 2), {
    status: 200,
    headers: {
      "Content-Type": ARD_CONTENT_TYPE,
      // Discovery agents fetch this cross-origin from a browser context.
      "Access-Control-Allow-Origin": "*",
      // The manifest changes rarely; allow shared caches to hold it for an hour.
      "Cache-Control": "public, max-age=3600",
    },
  });
}
