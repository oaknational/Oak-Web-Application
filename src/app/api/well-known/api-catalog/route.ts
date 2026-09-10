/**
 * API catalog for automated API discovery.
 *
 * Served at `/.well-known/api-catalog` via a rewrite in `next.config.ts`
 * (App Router does not route folders that start with a dot).
 *
 * - RFC 9727: Well-Known URI for API discovery
 *   https://www.rfc-editor.org/rfc/rfc9727
 * - RFC 9264: `application/linkset+json` document format
 *   https://www.rfc-editor.org/rfc/rfc9264
 */

/**
 * The `profile` parameter advertises that the linkset is an RFC 9727 API
 * catalog, per the media type registration in that RFC.
 */
const LINKSET_CONTENT_TYPE =
  'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"';

/**
 * One linkset member per advertised API. `anchor` is the API's base URL; the
 * link relations point a consumer at the machine-readable description
 * (`service-desc`), human-readable documentation (`service-doc`) and health
 * endpoint (`status`).
 */
const apiCatalog = {
  linkset: [
    {
      anchor: "https://open-api.thenational.academy",
      "service-desc": [
        {
          href: "https://open-api.thenational.academy/api/v0/swagger.json",
          type: "application/json",
          title: "Oak National Academy Curriculum Open API OpenAPI document",
        },
      ],
      "service-doc": [
        {
          href: "https://open-api.thenational.academy/docs",
          type: "text/html",
          title: "Oak National Academy Curriculum Open API documentation",
        },
        {
          href: "https://open-api.thenational.academy/playground",
          type: "text/html",
          title: "Oak National Academy Curriculum Open API playground",
        },
      ],
      status: [
        {
          href: "https://open-api.thenational.academy/api/health",
          type: "application/json",
          title: "Oak National Academy Curriculum Open API health check",
        },
      ],
    },
    // Oak Curriculum MCP server. Held back from the public catalog while it is
    // alpha and invitation-only (OAuth 2.1, internal/invited access only) —
    // listing it here would point discovery agents at an endpoint that rejects
    // them. Uncomment to advertise it once it reaches general availability.
    // {
    //   anchor: "https://curriculum-mcp-alpha.oaknational.dev/mcp",
    //   "service-doc": [
    //     {
    //       href: "https://curriculum-mcp-alpha.oaknational.dev/",
    //       type: "text/html",
    //       title: "Oak National Academy Curriculum MCP server",
    //     },
    //   ],
    // },
  ],
} as const;

export function GET() {
  return new Response(JSON.stringify(apiCatalog, null, 2), {
    status: 200,
    headers: {
      "Content-Type": LINKSET_CONTENT_TYPE,
      // The catalog changes rarely; allow shared caches to hold it for an hour.
      "Cache-Control": "public, max-age=3600",
    },
  });
}
