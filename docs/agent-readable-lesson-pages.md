# Agent Readable Lesson Pages

This document captures how OWA serves a machine-readable markdown representation
of a teacher lesson page, why it is served from a distinct `.md` URL rather than
by `Accept` content negotiation, and what has to change before negotiation can be
added.

The goal it serves: a consumer that is not a browser — a coding agent, an LLM
retrieval pipeline, a script — should be able to read a lesson page
deterministically, without parsing the rendered HTML.

## What is implemented

A lesson's markdown representation is served at the lesson URL plus a `.md`
suffix:

```text
https://www.thenational.academy/teachers/lessons/<lessonSlug>
https://www.thenational.academy/teachers/lessons/<lessonSlug>.md
```

The pieces:

- [src/utils/lessonToMarkdown.ts](../src/utils/lessonToMarkdown.ts) serialises
  `LessonOverviewPageData` into markdown. It is a pure function with a
  determinism contract: the same lesson data must always produce byte-identical
  output, so nothing in it reads the clock, the locale or the environment, and no
  collection is re-ordered.
- [src/app/api/teachers/lessons/\[lessonSlug\]/markdown/route.ts](../src/app/api/teachers/lessons/%5BlessonSlug%5D/markdown/route.ts)
  is the route handler. It looks the lesson up through
  `curriculumApi2023.lessonOverview`, the same call the lesson page's
  `getStaticProps` makes.
- A rewrite in [next.config.ts](../next.config.ts) maps the public `.md` URL to
  that handler, and a `Link` header on the lesson page advertises it.

The representation is **generated from the curriculum data, not converted from
the HTML**. Conversion would inherit the page's presentational structure —
navigation, cards, accordions, download buttons — and would change shape every
time the markup changed. Generating from the data means the markdown tracks the
curriculum instead of the layout, and it means there is no HTML-to-markdown
dependency to keep working.

### Discovery

The lesson page carries an RFC 8288 `Link` header pointing at its markdown
alternate:

```text
Link: </teachers/lessons/photosynthesis.md>; rel="alternate"; type="text/markdown"
```

This follows the pattern already used for the RFC 9727 API catalog, which is
advertised from the homepage with `Link: </.well-known/api-catalog>; rel="api-catalog"`.

The rewrite is doing real work here, not just prettifying a URL. `robots.txt`
carries `Disallow: /api`, so a well-behaved crawler would skip the handler's own
`/api/teachers/lessons/…/markdown` path. The public `.md` URL is not under
`/api`, so it stays crawlable; the rewrite is server-side and invisible to
clients. Publishing the `/api` path as the consumer-facing URL would have made
the representation undiscoverable to exactly the consumers it is for.

## Why a distinct URL and not `Accept` negotiation

`Accept: text/markdown` negotiation on the lesson URL is the better end state.
It costs one round trip instead of two, and the canonical URL stays canonical
rather than acquiring a parallel identity. It is not what shipped first, because
of what sits in front of the app.

### The caching reality, measured

`www.thenational.academy` sits behind **Cloudflare in front of Vercel**. Every
response carries `server: cloudflare`, `cf-ray` and `cf-cache-status` alongside
`x-vercel-cache` and `x-vercel-id`.

A teacher lesson page is an App Router prerender:

```text
x-matched-path: /teachers/programmes/[slug]/units/[unitSlug]/lessons/[lessonSlug]
x-nextjs-prerender: 1
x-nextjs-stale-time: 300
cache-control: public, max-age=0, must-revalidate
vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
vary: accept-encoding
```

Three things follow, and each was measured rather than inferred.

**Cloudflare does store lesson HTML.** Two successive requests for the same
lesson returned the same `x-vercel-id` with different `cf-ray` values, and
`cf-cache-status` went `MISS` then `REVALIDATED`. An identical `x-vercel-id`
across two separate client requests means the second body came out of
Cloudflare's store, not out of a fresh Vercel render.

**Header-based content negotiation already runs on this route in production.**
Next.js negotiates the RSC flight payload against the `RSC` request header, and
`vary: rsc` is on every response. Requesting a lesson with `RSC: 1` returns
`content-type: text/x-component`; requesting it without returns
`text/html; charset=utf-8`.

**It does not currently mix the two.** On a virgin Cloudflare cache key, an
`RSC: 1` request followed immediately by a plain browser request for the same key
returned `text/x-component` then `text/html; charset=utf-8`. Cloudflare did not
serve the stored flight payload to the browser.

### The part that matters

That last result is reassuring but it is **not** evidence that Cloudflare honours
`Vary`. The mechanism is `cache-control: public, max-age=0, must-revalidate`:
Cloudflare is never permitted to satisfy a request from its own store without
revalidating with the origin, and the origin routes each request by its headers.
The protection is incidental to how Next.js sets `Cache-Control` on a prerender,
not something the negotiation design chose.

The two layers behave differently, and the difference is the whole reason for the
implementation order:

- **Vercel's CDN already includes `Accept` in the cache key by default.** Its
  documentation states: "Vercel's CDN already includes the `Accept` and
  `Accept-Encoding` headers as part of the cache key by default. You don't need
  to explicitly include these headers in your `Vary` header."
  ([Vercel CDN Cache](https://vercel.com/docs/caching/cdn-cache)) So the Vercel
  layer needs no change to negotiate safely on `Accept`.
- **Cloudflare, by default, keys only on `Vary: Accept-Encoding`.** Since
  2026-07-02, Cache Rules support the origin `Vary` header on all plans, with a
  per-header `normalize` / `passthrough` / `bypass` action
  ([Vary](https://developers.cloudflare.com/cache/concepts/vary/),
  [changelog](https://developers.cloudflare.com/changelog/post/2026-07-02-vary-for-cache-rules/)).
  That is a zone configuration change, made in the Cloudflare dashboard or
  Rulesets API — it does not live in this repository.

So `Vary: Accept` **can** be made safe on the prerendered path. It is not safe to
rely on today, because the only thing standing between a markdown response and a
browser is a `Cache-Control` directive that no one chose deliberately for this
purpose. Any future Cache Rule that gives lesson HTML an Edge TTL — a perfectly
ordinary performance change — would let Cloudflare answer from its own store, and
at that moment a negotiated lesson URL starts serving markdown to browsers.

A distinct `.md` URL has none of this exposure. A different URL is a different
cache key at every layer, needs no `Vary`, and cannot mix representations even if
every cache in the chain ignores `Vary` entirely.

### Why the markdown route sets three cache headers

Measured on a preview deployment: a route handler setting only
`Cache-Control: public, s-maxage=300, stale-while-revalidate=86400` reached the
client as **`cache-control: public`** — Vercel strips `s-maxage` and
`stale-while-revalidate` from `Cache-Control` before forwarding, and documents
that it does. Vercel's own cache honoured the directive (`x-vercel-cache` went
`MISS` then `HIT` with `age: 35`), but Cloudflare would have received a bare
`public` with no freshness lifetime and fallen back to its own heuristics.

So the handler states each layer's directive explicitly: `Cache-Control` for the
browser (`max-age=0, must-revalidate`, matching the lesson page),
`CDN-Cache-Control` for downstream CDNs — the one Cloudflare actually sees — and
`Vercel-CDN-Cache-Control` for Vercel's own cache.

### Why the rewrite cannot affect HTML caching

The rewrite source requires the literal `.md` suffix and constrains the slug to
`[a-z0-9-]+`, so it matches the markdown URL and nothing else:

| Request path                             | Rewrite source matches? |
| ---------------------------------------- | ----------------------- |
| `/teachers/lessons/photosynthesis`       | no                      |
| `/teachers/lessons/photosynthesis.md`    | yes                     |
| `/teachers/lessons/photosynthesis/media` | no                      |

The `Link` header's source excludes a dot for the mirror-image reason, so the
`.md` response does not advertise `<slug>.md.md`. It adds a response header only:
no `Cache-Control` change and no `Vary` change, so the lesson page's cache
behaviour is untouched.

## Adding negotiation later

Negotiation becomes a thin layer on top of the handler that already exists. Two
steps, in this order.

**1. Configure Cloudflare.** Add a Cache Rule for the lesson page paths with the
`Vary` setting covering `Accept`. Until this exists, do not proceed — this is the
step that makes the cache key correct rather than accidentally correct.

**2. Add a conditional rewrite** in [next.config.ts](../next.config.ts), routing
markdown-preferring requests on the lesson URL to the same handler:

```ts
{
  source: "/teachers/lessons/:lessonSlug([a-z0-9-]+)",
  has: [{ type: "header", key: "accept", value: ".*text/markdown.*" }],
  destination: "/api/teachers/lessons/:lessonSlug/markdown",
}
```

The negotiated response must then carry `Vary: Accept`. Note that the dedicated
`.md` route deliberately does **not** send `Vary`, because it returns markdown
whatever the request asked for — listing `Accept` there would be false.
`Vary: Accept` belongs on the negotiated lesson URL, and only there.

Both representations should stay available afterwards. The `.md` URL is useful in
its own right: it can be linked, pasted and crawled, and it does not depend on a
client being able to set request headers.

## What the markdown contains

YAML frontmatter carries identity and handling flags, then the lesson's teaching
content as sections. Sections with no content are omitted rather than left as
empty headings.

Frontmatter: `title`, `lesson-slug`, `canonical-url`, `subject`, `key-stage`,
`unit`, and where present `year`, `exam-board`, `tier`, `lesson-release-date`;
then the handling flags `login-required`, `geo-restricted`, `expired`,
`excluded-from-teaching-materials`, and `licence`.

Sections: lesson outcome, content guidance, key learning points, lesson outline,
keywords, common misconceptions, teacher tips, equipment and resources, starter
quiz, exit quiz, video and transcript link, downloads available, copyright.

### Deliberate omissions

**Quiz correct answers, feedback and hints are omitted.** They are present in the
lesson data (`answerIsCorrect`, `correctChoice`, `correctOrder`). Oak distributes
answer keys as separate `*-quiz-answers` downloads; emitting them here would
publish an answer key for every lesson as plain text at a URL a pupil can guess
from the lesson URL.

**Restricted lessons get frontmatter and a pointer, not a body.**
`loginRequired` and `geoRestricted` mark lessons whose materials Oak licenses
from third parties, so the representation withholds the body for those and links
the page instead.

This is deliberately **stricter than the lesson page**, and that asymmetry is
worth stating plainly. The page's `getStaticProps` returns the entire lesson
payload — quiz answers and full transcript included — to anonymous visitors
inside `__NEXT_DATA__`; the restriction implemented in
[src/hooks/useComplexCopyright.ts](../src/hooks/useComplexCopyright.ts) is
client-side and only suppresses the download and share affordances. So "match
what the page exposes" is the weaker standard here, not the stronger one. That
the data is already reachable by reading the page's embedded JSON is not a
decision to republish it as plain text at a cacheable URL.

**The transcript is linked, not inlined.** This is a pragmatic choice rather than
a disclosure one: inlining would multiply the document size for a minority of
consumers, and populating it requires a separate fetch from the captions bucket.

**Media clip asset URLs and Mux playback identifiers are omitted.** They are
asset locators rather than lesson content.

### Open questions for a content owner

These are editorial decisions, not engineering ones, and the conservative option
was taken pending a ruling:

1. Should the markdown representation carry quiz correct answers? The data is
   already public in the page payload, so withholding them is not a security
   control — it is a judgement about practical exposure.
2. Should restricted (`loginRequired` / `geoRestricted`) lessons have a markdown
   body at all, given the page already ships one in `__NEXT_DATA__`?
3. `excludedFromTeachingMaterials` marks lessons excluded from AI
   teaching-materials reuse. It is currently surfaced as a frontmatter flag for
   consumers to honour, and is **not** used to withhold content. If it is meant
   to mean "do not re-serve this lesson in machine-readable form", it should
   gate this route instead.

## Scope

Teacher lesson pages only. Pupil lesson pages, unit and programme pages, and
curriculum pages have no markdown representation. The structured-data surfaces —
the Curriculum Open API and the MCP server, both advertised through
[the API catalog](../src/app/api/well-known/api-catalog/route.ts) — are
deliberately out of scope: they already serve machines, in formats better suited
to it than markdown.
