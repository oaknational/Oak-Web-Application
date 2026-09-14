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

Measured 14 September 2026, no deployed publisher has caught up with that:

| Publisher                   | `ai-catalog.json` | `ard.json` | Link relation                    |
| --------------------------- | ----------------- | ---------- | -------------------------------- |
| `github.com`                | 200               | 404        | none                             |
| `huggingface.co`            | 200               | 401        | `ai-catalog`, as a `Link` header |
| `developers.cloudflare.com` | 200               | 404        | none                             |

Hugging Face does advertise the predecessor relation, but only in the HTTP
response header and not from the document head:

```text
link: </.well-known/ai-catalog.json>; rel="ai-catalog"; type="application/ai-catalog+json"
```

No publisher emits `rel="ard"` at all, and none emits either relation from the
document head. The spec is six weeks old; the consumers are older. Serving both
paths costs one rewrite and makes Oak findable by agents written against either
revision. **Do not simplify this to one path.** Oak emits both relations from
both places — the head and the homepage `Link` header — a superset of what any
reference publisher does.

## Why the MCP entry carries no server card URL

Measured 14 September 2026:

- The MCP working group's discovery document lists all three `.well-known`
  server-card paths under "Alternatives considered … not recommended", so
  publishing one there would adopt a placement its own authors rejected.
- The reserved location is `<streamable-http-url>/server-card`, and Oak does not
  serve it. What `https://mcp.thenational.academy/mcp/server-card` returns
  depends entirely on the `Accept` header:

  | `Accept`                              | Status | Served by                  |
  | ------------------------------------- | ------ | -------------------------- |
  | `application/json, text/event-stream` | 404    | the app — path is unrouted |
  | `text/event-stream`                   | 404    | the app — path is unrouted |
  | `application/json`                    | 406    | streamable-HTTP transport  |
  | `application/mcp-server-card+json`    | 406    | streamable-HTTP transport  |
  | `*/*`                                 | 406    | streamable-HTTP transport  |
  | `text/html`                           | 200    | the `/mcp` landing page    |

  Under a real MCP `Accept` header the path is unrouted and answers `404`, so
  **the path is free** and a card could be served there. The `200` is not the
  path being occupied: the `/mcp` landing app is a catch-all, and any
  nonexistent path under `/mcp` returns that same page to a browser.

So the entry names the MCP endpoint itself, inline via `data`. §4.3 allows
exactly one of `url` or `data`, and `data` is the only one that can name the
endpoint truthfully today: a `url` of media type
`application/mcp-server-card+json` would have to dereference to a card
document, and none is served yet. Serving one at the reserved location is the
better end state — it keeps `version` current automatically instead of pinning
it here — and is tracked as `MCP-422`.

### Card fields

The card carries every field the schema requires. The authoritative schema is
`https://static.modelcontextprotocol.io/schemas/2025-09-29/server.schema.json`,
which requires `name`, `description` and `version`, and caps `description` at
**100 characters**.

- **`$schema`** points at that dated URL, which resolves. Both `github.com` and
  `huggingface.co` point instead at `.../schemas/v1/server-card.schema.json`,
  which returns 404. That 404 is not itself a problem — `$schema` identifies the
  dialect and is not required to be dereferenceable — but where a resolvable
  authoritative URL exists there is no reason to emit a broken one. It is the
  `$id` of the published schema, and the example that schema gives for this very
  field.
- **`version`** is `1.181.1`, the deployed server's own build version, read from
  the `x-app-version` header it sets on every response. It is measured, not
  invented. Because this manifest is static it lags a deploy until the line is
  updated; a card served by the MCP server itself would not.
- **`description`** is held under 100 characters. The fuller statement of what
  Oak is lives in the entry `description` beside it, which the ARD entry schema
  does not cap, so nothing is lost from the document.

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
The spec recommends 2–5 per entry, and both entries carry them.

The two sets are written for **different audiences**, and are kept deliberately
disjoint. Both entries land in the same registry index, so queries that overlap
make Oak's two resources compete with each other for the same search rather
than each answering the search it is right for.

- The **MCP entry** is reached by a teacher talking to an assistant, so its
  queries are task-shaped and in a teacher's words: a topic and a year group, a
  progression across key stages, a worksheet for a lesson.
- The **API entry** is reached by a developer integrating against REST, so its
  queries name artefacts rather than tasks — REST API, OpenAPI description,
  bulk download, dataset, licensing — and state integration intent. A developer
  looking for a curriculum API does not search the way a teacher planning a
  lesson does.

## Conformance

Validated with the official conformance CLI from `ards-project/ard-spec`, run
with `jsonschema` installed so the strict schema check actually executes:
**0 errors**, against both the source manifest and the served response.

The ARD conformance tool validates the envelope and the entries; it does not
look inside an entry's inline `data`, so it never checked the MCP server card.
That gap is why a 195-character `description` and a missing `version` sat in
the card while the manifest reported clean. The card is now validated
separately against
`https://static.modelcontextprotocol.io/schemas/2025-09-29/server.schema.json`
(14 September 2026, `ajv`): **valid**, with the previous card failing the same
check on exactly those two counts. `route.test.ts` guards both, so neither can
regress silently.

One warning remains, on the API entry's `application/linkset+json` media type,
which is not in the tool's list of standard discovery types. The type is correct
for what the URL serves and matches its `Content-Type` exactly; the spec
constrains `type` to an IANA media type and does not restrict it to that list.

For context on the state of the ecosystem, the same tool reports `github.com`'s
own manifest as **non-conformant** (its single entry is missing `displayName`),
and `huggingface.co` passes but carries no representative queries on either
entry, so neither of its resources is searchable.
