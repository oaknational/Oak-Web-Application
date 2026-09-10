/**
 * Agentic Resource Discovery manifest, served at `/.well-known/ard.json` and
 * `/.well-known/ai-catalog.json` via rewrites in `next.config.ts`.
 *
 * Why both paths, why the MCP entry has no card URL, and why the API entry
 * points at a catalogue: `docs/agent-discovery.md`.
 *
 * - Spec v0.91: https://agenticresourcediscovery.org/spec/
 * - Schema and conformance CLI: https://github.com/ards-project/ard-spec
 */
const ARD_CONTENT_TYPE = "application/ai-catalog+json";

/**
 * Inline rather than a `url`: Oak serves no server card document, and the
 * `.well-known` card paths are a placement the MCP working group rejected.
 * `$schema` and `version` are omitted deliberately — see
 * `docs/agent-discovery.md`.
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
 * ARD requires only `entries`; `specVersion` and `host` are transport-defined
 * members it ignores, emitted because every reference publisher emits them.
 *
 * Each entry needs `identifier`, `displayName`, `type`, exactly one of
 * `url`/`data`, and 2-5 `representativeQueries` — the queries are what a
 * registry indexes on, so an entry without them cannot be found by search.
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
      // The catalogue hosted BY the API, not the copy on www: the two disagree
      // and only this one carries `/api/bulk`. MCP-721.
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
      "Cache-Control": "public, max-age=3600",
    },
  });
}
