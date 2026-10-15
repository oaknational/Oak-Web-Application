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
 *
 * Field order and set mirror the live cards on `huggingface.co` and
 * `github.com`. `name`, `description` and `version` are required by the
 * schema, and `description` is capped at 100 characters — see
 * `docs/agent-discovery.md`.
 */
const mcpServerCard = {
  // The dated schema URL, which resolves. Both reference publishers point at
  // an unversioned `v1/server-card.schema.json` that 404s; this is the `$id`
  // of the published schema and the example its own `$schema` field gives.
  $schema:
    "https://static.modelcontextprotocol.io/schemas/2025-09-29/server.schema.json",
  name: "thenational.academy/mcp",
  // The deployed server's own build version, read from the `x-app-version`
  // response header it sets on every response. Pinned here because the
  // manifest is static, so it lags a deploy until this line is updated; the
  // durable fix is a card served by the MCP server itself. MCP-422.
  version: "1.181.1",
  // 100 characters is the schema maximum. The fuller statement of what Oak is
  // lives in the entry `description` below, which the ARD schema does not cap.
  description:
    "Search lessons and units in Oak National Academy's free, openly licensed curriculum for England.",
  title: "Oak Curriculum",
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
      // Written for a developer integrating against REST, not a teacher: this
      // entry competes with the MCP entry above in the same registry index, so
      // the two sets are kept deliberately disjoint in both vocabulary and
      // intent. Named artefacts (REST, OpenAPI, bulk download, dataset) are
      // what a developer searches for; task phrasing belongs to the MCP entry.
      representativeQueries: [
        "REST API for England's school curriculum lessons and units",
        "OpenAPI description and playground for an education content API",
        "bulk download an openly licensed curriculum dataset",
        "integrate Oak curriculum content into an application",
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
