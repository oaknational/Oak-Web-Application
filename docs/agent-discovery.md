# Agent discovery

Oak publishes a machine-readable manifest of its agent-usable resources, so an
AI agent can find the curriculum MCP server and the curriculum API from the apex
domain without being told where to look.

## What is served

An [Agentic Resource Discovery](https://agenticresourcediscovery.org/spec/)
manifest, at **both**:

- `/.well-known/ard.json`
- `/.well-known/ai-catalog.json`

as `application/ai-catalog+json` with `Access-Control-Allow-Origin: *`, plus
`<link rel="ard">` and `<link rel="ai-catalog">` in the document head and the
matching relations on the homepage `Link` header.

Source: `src/app/api/well-known/ard/route.ts`, mapped onto `/.well-known/` by
rewrites in `next.config.ts` because the App Router does not route a folder
beginning with a dot. This follows the pattern already used for the RFC 9727
catalogue at `/.well-known/api-catalog`.

## Why both paths, when the spec says one is enough

Spec v0.91 §5.1 is explicit: a consumer MUST fetch `ard.json` and MUST honour
`rel="ard"`, and _"there is no need to serve the predecessor path or relation as
well"_.

Measured 9 September 2026, no deployed publisher has caught up with that:

| Publisher                   | `ai-catalog.json` | `ard.json` |
| --------------------------- | ----------------- | ---------- |
| `github.com`                | 200               | 404        |
| `huggingface.co`            | 200               | 401        |
| `developers.cloudflare.com` | 200               | 404        |

None of the three emits either link relation. The spec is six weeks old; the
consumers are older. Serving both costs one rewrite and makes Oak findable by
agents written against either revision. **Do not simplify this to one path.**

## Why the MCP entry carries no server card URL

Measured 9 September 2026:

- The MCP working group's discovery document lists all three `.well-known`
  server-card paths under "Alternatives considered … not recommended", so
  publishing one there would adopt a placement its own authors rejected.
- The reserved location is `<streamable-http-url>/server-card`, and Oak does not
  serve it. `https://mcp.thenational.academy/mcp/server-card` answers `406`
  with `{"error":"Accept header must include text/event-stream"}` for every
  Accept header — that is the streamable-HTTP transport catching the path, not a
  card route.

So the entry names the MCP endpoint itself, inline via `data`. §4.3 allows
exactly one of `url` or `data`, and `data` is the only one that can name the
endpoint truthfully: a `url` of media type `application/mcp-server-card+json`
would have to dereference to a card document, and none exists.

The inline card mirrors the field set of the live cards on `github.com` and
`huggingface.co`, minus two. `$schema` is omitted because the URL both of them
point at returns 404. `version` is omitted because this server does not publish
one, and inventing it would be fabricated metadata.

## Why the API entry points at a catalogue

Oak publishes two RFC 9727 catalogues and they disagree. Measured
9 September 2026, the one hosted by the API anchors both `/api/v0` and
`/api/bulk`; the copy on `www` carries a single anchor for the v0 host only.

The entry therefore references
`https://open-api.thenational.academy/.well-known/api-catalog`, which advertises
Oak's whole API surface and stays true as that surface grows, rather than
pinning one OpenAPI document. The drift between the two catalogues is tracked as
`MCP-721` and is not addressed here.

## Representative queries

`representativeQueries` is the text a registry builds its semantic index from —
an entry without it is a valid catalogue entry but will not be found by search.
The spec recommends 2–5 per entry. Oak's are written in the language a teacher
would actually use, and both entries carry them.

## Conformance

Validated with the official conformance CLI from `ards-project/ard-spec`, run
with `jsonschema` installed so the strict schema check actually executes:
**0 errors**, against both the source manifest and the served response.

One warning remains, on the API entry's `application/linkset+json` media type,
which is not in the tool's list of standard discovery types. The type is correct
for what the URL serves and matches its `Content-Type` exactly; the spec
constrains `type` to an IANA media type and does not restrict it to that list.

For context on the state of the ecosystem, the same tool reports `github.com`'s
own manifest as **non-conformant** (its single entry is missing `displayName`),
and `huggingface.co` passes but carries no representative queries on either
entry, so neither of its resources is searchable.
