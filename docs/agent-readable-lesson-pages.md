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

A teacher lesson page is served from Vercel's CDN as a prerender. Measured
against production on 2026-09-09, on the canonical lesson URL this feature
actually targets:

```text
$ curl -sSD - -o /dev/null https://www.thenational.academy/teachers/lessons/create-a-history-map
cache-control: public, max-age=0, must-revalidate
vary: accept-encoding
x-matched-path: /teachers/lessons/[lessonSlug]
x-vercel-cache: MISS            (HIT once warm)
server: cloudflare
cf-cache-status: EXPIRED
```

Note what is **not** there: no `x-nextjs-prerender`, no `x-nextjs-stale-time`,
and no `rsc` in `Vary`. Those headers do appear on the programme-scoped lesson
route (`/teachers/programmes/[slug]/units/[unitSlug]/lessons/[lessonSlug]`), so
measurements taken there do not describe this route.

Four things follow, each measured rather than inferred.

**Cloudflare does store lesson HTML.** Two successive requests for the same
lesson returned the same `x-vercel-id` with different `cf-ray` values, and
`cf-cache-status` went `MISS` then `REVALIDATED`. An identical `x-vercel-id`
across two separate client requests means the second body came out of
Cloudflare's store, not out of a fresh Vercel render.

**`Accept: text/markdown` on the lesson URL returns HTML today**, with
`content-type: text/html; charset=utf-8`; the `.md` suffix returned `404` before
this change. That is the gap AR-A5 names.

**Vercel's CDN does not key on `Accept` on this route.** Vercel's documentation
says it does — "Vercel's CDN already includes the `Accept` and `Accept-Encoding`
headers as part of the cache key by default"
([CDN Cache](https://vercel.com/docs/caching/cdn-cache)) — but that is not what
this path does. On a query string never requested before, three successive
requests sending `Accept: text/markdown`, then `Accept: text/html`, then
`Accept: application/x-nonsense` all returned `x-vercel-cache: HIT` carrying the
**same `x-vercel-id`**: one stored entry answered all three. Vercel's own
cache-key documentation is the consistent half — the base key it lists is method,
URL (query strings ignored for static files), host, deployment and scheme, with
no `Accept`
([Purging the cache](https://vercel.com/docs/caching/cdn-cache/purge)).

Two control probes establish that this instrument can see what it claims to see.
A path with no cached entry reports `x-vercel-cache: MISS`, so a `HIT` is a real
observation and not a default. And header-keyed variants of this very URL _do_
get their own entries with their own `x-vercel-id` — see the next point. The
`Accept` result is therefore a refutation, not a blind spot.

**Next.js negotiates on this route already, and does it with a distinct path
rather than with `Vary`.** Requesting a lesson with `RSC: 1` returns
`x-matched-path: /teachers/lessons/[lessonSlug].rsc` and
`content-type: application/json`; requesting it without returns
`x-matched-path: /teachers/lessons/[lessonSlug]` and `text/html`. They are two
cache entries with two `x-vercel-id`s, and the HTML entry's `Vary` does not even
mention `rsc` — only the `.rsc` variant carries
`vary: rsc, next-router-state-tree, …`. So the framework in front of this app,
faced with exactly this problem, separated its representations **by path**, not
by a `Vary`-keyed variant of one object.

### The part that matters

The two layers in front of the app both fail to key on `Accept` today, and
neither failure is fixed from inside this repository.

- **Vercel** is documented to include `Accept` in the cache key by default, and
  measurably does not do so for this prerendered route (above). Cache keys are
  not configurable ("Cache keys are not configurable" —
  [Purging the cache](https://vercel.com/docs/caching/cdn-cache/purge)), so this
  is not something a repository change can set.
- **Cloudflare's default cache key contains no `Accept` header at all.** It is
  the full URL plus `Origin` and a short list of `x-…` override headers
  ([Cache keys](https://developers.cloudflare.com/cache/how-to/cache-keys/)).
  `Accept-Encoding` is not varied on either — Cloudflare _overrides_ it toward
  the origin based on the zone's enabled compression. Honouring an origin `Vary`
  requires a Cache Rule carrying a `vary` object; omit that object and "this
  Cache Rules Vary setting is turned off"
  ([Vary](https://developers.cloudflare.com/cache/concepts/vary/),
  [Cache Rules settings](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/)).
  It is available on all plans since 2026-07-02
  ([changelog](https://developers.cloudflare.com/changelog/post/2026-07-02-vary-for-cache-rules/)),
  and it is a zone configuration change made in the dashboard or the Rulesets
  API — it does not live in this repository.

Representations do not currently mix, and it is worth being precise about why,
because the reason is not `Vary`. On a virgin cache key an `RSC: 1` request
followed by a plain browser request returned JSON then HTML correctly — but that
is the distinct-path mechanism above, not `Vary`. For `Accept` there is no
distinct path, and the only thing standing between a markdown response and a
browser would be `cache-control: public, max-age=0, must-revalidate` forcing
Cloudflare to revalidate with the origin on every request. That directive is how
Next.js happens to set `Cache-Control` on a prerender. Nobody chose it to protect
a negotiation, and any ordinary future Cache Rule giving lesson HTML an Edge TTL
— a perfectly reasonable performance change — would remove it and start serving
markdown to browsers.

So `Vary: Accept` on the lesson URL **cannot be made safe from this repository
today**. That is the finding, and it is what decided the implementation.

A distinct `.md` URL has none of this exposure. A different URL is a different
cache key at every layer, needs no `Vary`, and cannot mix representations even if
every cache in the chain ignores `Vary` entirely. It is also the mechanism
Next.js reached for on this same route for its own flight payload, which is a
reasonable precedent to follow rather than argue with.

### Cloudflare's `Markdown for Agents` does the negotiation half, at the zone

[MCP-632](https://linear.app/oaknational/issue/MCP-632/markdown-negotiation) is
written against Cloudflare's
[Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/),
and it deserves stating plainly that this feature exists and that it is not this
change. It is a zone toggle — `AI Crawl Control` in the dashboard, or `PATCH
/zones/{zone}/settings/content_converter` with `{"value": "on"}` — after which
Cloudflare answers `Accept: text/markdown` by fetching the origin's HTML and
converting it at the edge, adding `Accept` to `Vary` itself. It is available on
Pro, Business and Enterprise plans, converts HTML only, and caps the origin
response at 2 MB.

So the negotiation half of the ticket is reachable without any application code,
and the two approaches are complementary rather than competing:

- **What the zone toggle gives**: `Accept` negotiation on every page of the site
  — curriculum pages, unit pages, everything — for no engineering cost, and one
  round trip on the canonical URL.
- **What it cannot give**: control over _what_ the markdown says. It converts the
  rendered page, so the output carries the page's navigation, cards, accordions
  and download affordances, changes shape whenever the markup changes, and offers
  no place to make the editorial decisions this document records — withholding
  quiz answers, withholding restricted-lesson bodies, linking rather than
  inlining the transcript. It also drops `ETag` and `Last-Modified`, so
  conditional requests stop working on the converted response.
- **The caching question does not disappear.** The feature's documentation says
  the converted response carries `Vary: Accept` "so that caches store separate
  variants for Markdown and HTML", but Cloudflare's own `Vary` documentation is
  clear that an origin `Vary` enters Cloudflare's cache key only when a Cache
  Rule carries a `vary` object. Whether enabling `Markdown for Agents`
  configures that for its own zone is not documented either way. On today's
  lesson pages the `must-revalidate` directive would mask the difference, which
  is the same accidental protection described above — so this needs measuring on
  the zone before anyone relies on it.

Enabling it is an infrastructure and plan decision for the zone owner, not a
repository change, and it is worth a deliberate ruling rather than being left
implicit. The recommendation from this lane: enable it for breadth, and keep the
data-generated `.md` representation for the lesson pages, where what the document
says has been decided on purpose.

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

### Where the 300 comes from, and where it does not

Five minutes is a choice made for this handler, not a number inherited from the
lesson page, and it is worth recording because the obvious-looking provenance is
wrong.

The canonical lesson URL emits **no `x-nextjs-stale-time`**, which is the same
finding as the measurement above. Re-measured 2026-09-10:

```text
$ curl -sSD - -o /dev/null https://www.thenational.academy/teachers/lessons/adverbial-complex-sentences
cache-control: public, max-age=0, must-revalidate
x-matched-path: /teachers/lessons/[lessonSlug]
(no x-nextjs-prerender, no x-nextjs-stale-time)
```

It is a **Pages Router** route (`src/pages/teachers/lessons/[lessonSlug].tsx`),
and its own regeneration window is the ISR `revalidate` that
`decorateWithIsr` sets from `SANITY_REVALIDATE_SECONDS` — a value that never
appears in a response header, so it cannot be read off the wire at all.

The route that does answer `x-nextjs-stale-time: 300` is the **App Router**
programme-scoped lesson route:

```text
$ curl -sSD - -o /dev/null https://www.thenational.academy/teachers/programmes/english-primary-year-5/units/complex-sentences/lessons/adverbial-complex-sentences
x-matched-path: /teachers/programmes/[slug]/units/[unitSlug]/lessons/[lessonSlug]
x-nextjs-prerender: 1
x-nextjs-stale-time: 300
```

and that 300 is this repository's own `experimental.staleTimes.static` in
`next.config.ts`. It is a **client** router-cache prefetch lifetime — how long a
prefetched RSC payload stays usable in the browser — not a shared-cache
revalidation window, and the Pages Router lesson page is not subject to it.

So the handler's `s-maxage=300` stands on its own reasoning: short relative to
how rarely lesson content changes, with a long `stale-while-revalidate` on top so
a shared cache serves while it revalidates. Nothing about it is derived from the
lesson page, and a future change to `staleTimes.static` has no bearing on it.

### Why the not-found and redirect responses cache differently

`<slug>.md` is trivially enumerable — anyone can append `.md` to any slug they
can invent — so a 404 that sets no cache headers puts every miss through to the
curriculum API. The miss responses therefore carry `s-maxage=60` and,
deliberately, **no `stale-while-revalidate`**: a "not found" must never be served
from a stale entry after it has stopped being true, so a newly published lesson
cannot sit behind a cached 404 for more than a minute. The redirect responses
take the same window for the same reason.

### Why the route follows the canonical redirect table

The lesson page and the media page both consult
`canonicalLessonRedirectQuery` (via `getRedirect`) before returning `notFound`,
so a renamed lesson keeps working on its old slug. This route now does the same
step, and points the `Location` at the markdown representation — `<old>.md`
redirects to `<new>.md` rather than dropping a markdown consumer into an HTML
page it did not ask for. A destination that is not a bare canonical lesson path
is passed through unchanged.

Note that `canonicalLessonRedirectQuery` *throws* `curriculum-api/not-found`
when the table holds no row, rather than returning nothing, so the call is
wrapped in `allowNotFoundError` exactly as the lesson lookup is: no redirect row
is the ordinary case for a slug that never existed, and only a different failure
propagates.

### Why the rewrite cannot affect HTML caching

`rewrites()` here returns a plain array, and Next.js applies those "after
checking the filesystem (pages and `/public` files) and before dynamic routes"
([rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites)).
The lesson page is a _dynamic_ route, so **route precedence does not protect it**
— this rewrite is evaluated first, and the `source` pattern is the only thing
keeping it off the HTML URL. Anyone loosening that pattern is removing the only
guard, so it is worth stating what the pattern actually compiles to.

Compiled with the `path-to-regexp` that ships inside the installed Next, the
source `/teachers/lessons/:lessonSlug([a-z0-9-]+).md` becomes:

```text
^\/teachers\/lessons(?:\/([a-z0-9-]+))\.md[\/#\?]?$
```

The literal dot is escaped by the compiler (`\.md`), so it cannot act as a regex
wildcard — which matters, because an unescaped dot would have made the pattern
match any lesson whose slug ends in `md` and rewritten it to the wrong slug.
Checked explicitly:

| Request path                             | Rewrite source matches?     |
| ---------------------------------------- | --------------------------- |
| `/teachers/lessons/photosynthesis`       | no                          |
| `/teachers/lessons/photosynthesis.md`    | yes (slug `photosynthesis`) |
| `/teachers/lessons/photosynthesis/media` | no                          |
| `/teachers/lessons/introduction-to-amd`  | no                          |
| `/teachers/lessons/what-is-a-cmd`        | no                          |
| `/teachers/lessons/nnmd`                 | no                          |

The last three are the cases an unescaped dot would have caught, and they are the
regression test to re-run if the pattern is ever edited.

The `Link` header's source excludes a dot for the mirror-image reason, so the
`.md` response does not advertise `<slug>.md.md`. It adds a response header only:
no `Cache-Control` change and no `Vary` change, so the lesson page's cache
behaviour is untouched.

## Adding negotiation later

Negotiation becomes a thin layer on top of the handler that already exists. Two
steps, in this order.

**1. Make both cache layers key on the representation, and prove it.** Two
prerequisites, and neither is satisfied by writing code here.

- Add a Cloudflare Cache Rule for the lesson page paths carrying a `vary` object
  covering `Accept`. Until this exists, do not proceed — this is the step that
  makes the cache key correct rather than accidentally correct.
- Establish what Vercel does, because it is measurably _not_ keying on `Accept`
  on this route despite documenting that it does. The `has`-conditioned rewrite
  below produces a distinct `x-matched-path`, and distinct matched paths do get
  their own Vercel cache entries — that is how the `.rsc` variant works. Whether
  that holds for a `has`-header rewrite against a prerendered route is
  **unmeasured**. Measure it on a preview deployment first, using the same
  method as above: warm one representation on a virgin cache key, then request
  the other and compare `x-vercel-id`. A shared `x-vercel-id` means the two
  representations share one entry, and negotiation must not ship.

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

### Curriculum values are escaped

Every value from the curriculum database is escaped as inline markdown text
before it enters the document, and any newline inside a value is collapsed to a
space. Curriculum content is authored for the lesson page, not for markdown, and
sampling 3,589 values from 50 production lessons found real content that changes
the document's structure when it is interpolated raw:

- KS3 computing quiz stems that are bare HTML tags — `<p>`, `<div>`, and
  `<link rel="stylesheet" href="styles.css">`, which markdown passes through as
  raw HTML, so the question renders as nothing at all
- French and Spanish sound-symbol lessons, whose keywords are written in
  brackets — `[e]`, `[rr]`, `[qui]`
- a PE stem that begins `1. `, which opens a nested ordered list
- a Python stem carrying a fenced code block, whose blank line ends the list item
  and whose fence swallows the following `## Exit quiz` heading

Escaping is uniform rather than per-field. Some of this content was authored as
markdown — a few stems use `**bold**`, and science content writes formulae as
`$$NO_2$$` — but nothing in the data marks which values those are, and guessing
which to trust is what leaves the document open to the rest. So every value is
rendered as the text it is. Carrying emphasis and MathJax through faithfully
needs the curriculum data to say where they are; that is separate work.

Frontmatter values take a different quoter, `JSON.stringify`, because a
double-quoted YAML scalar uses JSON's escaping rules. The lesson slug takes a
third treatment, `encodeURIComponent`, because it lands in a link destination
rather than in text, and a destination ends at the first space or bracket.

Whitespace collapsing is limited to line breaks and runs of ordinary spaces. A
non-breaking or narrow space is content — French punctuation spacing uses one —
so `\s` is deliberately not used.

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
