# Content Signals

Oak declares a Content Signals policy in `robots.txt`, stating what automated
clients may do with content they fetch from this site.

## What is served

Inside the `User-agent: *` group of `https://www.thenational.academy/robots.txt`:

```text
Content-Signal: ai-train=no, search=yes, ai-input=no
```

The three signals are defined by [contentsignals.org](https://contentsignals.org/):

| Signal     | Meaning                                                         | Oak's value |
| ---------- | --------------------------------------------------------------- | ----------- |
| `search`   | Building a search index and linking to results                  | `yes`       |
| `ai-input` | Supplying content to a model at inference time (RAG, grounding) | `no`        |
| `ai-train` | Training or fine-tuning a model                                 | `no`        |

These values were decided by Aakash and relayed by MG on 10 September 2026.
The reasoning, and why `open-api` deliberately says something different, is
under [Why the hosts differ](#why-the-hosts-differ-deliberately).

## How it is served

`robots.txt` is generated at build time by `next-sitemap`, from
`next-sitemap.config.js`, and written into `public/` by the `postbuild` script.

next-sitemap's robots builder emits only `Allow`, `Disallow` and `Crawl-delay`
for each policy group, so there is no configuration key for this directive. It
is injected by the `transformRobotsTxt` hook, which is next-sitemap's supported
extension point for exactly this.

That hook throws if the `User-agent: *` group is missing from the generated
output, which names the cause in the build log. It cannot fail the build on its
own. next-sitemap registers `robots.txt`, the sitemaps and the sitemap index
before writing any of them, swallows every failure into a bare `console.error`,
and exits 0 — so a throw here ships a deploy carrying **no `robots.txt` and no
sitemaps at all**. Both `public/robots.txt` and `public/sitemap*.xml` are
gitignored, so nothing in review or in CI would show it.

Two checks close that, and they guard different things.

`scripts/build/assert_robots_content_signal` guards **emission**. It runs after
next-sitemap in `postbuild`, reads the file that actually landed on disk, and
exits non-zero — naming what is missing — if there is no `robots.txt`, no
`User-agent: *` group, or no `Content-Signal:` directive on the line immediately
below that group. `postbuild` deletes `public/robots.txt` before generating, so
the assertion cannot pass on a stale file left by an earlier local build.

`src/tests/e2e/robots/content-signal.spec.ts` guards the **values**. It asserts
the exact directive against the served file, spelled out rather than imported,
and asserts its exact position: the line immediately after `User-agent: *`. A
directive outside the group applies to nobody.

## Why the hosts differ, deliberately

Oak's public hosts do not all declare the same thing, and that is policy rather
than drift. Other hosts measured 9 September 2026:

| Host                           | `robots.txt` | `Content-Signal`                                                   |
| ------------------------------ | ------------ | ------------------------------------------------------------------ |
| `www.thenational.academy`      | 200          | `ai-train=no, search=yes, ai-input=no` — introduced by this change |
| `open-api.thenational.academy` | 200          | `ai-train=yes, search=yes, ai-input=yes`                           |
| `mcp.thenational.academy`      | 404          | none — the host serves no `robots.txt`                             |

The two differ because what they serve differs. `www` carries Oak's own
copyrighted site content, so it declines both training and grounding.
`open-api` serves the openly licensed curriculum, where `ai-train=yes` is the
coherent position. Two hosts, two licences, two policies.

Aakash settled the `www` values, relayed by MG on 10 September 2026:

> On content signals -> I think it's probably sensible to take the approach of
> ai-train=no, search=yes, and ai-input=no. This makes sense for the main site
> which has content that is copyrighted.

Read "copyrighted" precisely, because `www`'s own
[`/llms.txt`](https://www.thenational.academy/llms.txt) states twice that Oak's
educational content is published under the Open Government Licence v3, free to
adapt commercially — which at a glance looks like the opposite claim. It is not.
OGL is itself a **copyright** licence: it grants permissions over rights Oak
holds, it does not put the content out of copyright. And llms.txt scopes its own
statement — "unless otherwise stated". What separates the hosts is the surface
each one exposes. `open-api` serves the curriculum corpus and nothing else, so
that surface is uniformly OGL. `www` is a whole website: the same curriculum, and
also everything the site is built out of around it. One of those surfaces can be
handed to a model wholesale on the licence alone; the other cannot.

If these two hosts ever look like a contradiction to be tidied away, they are
not. Change either only with the same authority that set it.

One thing this does **not** settle: `open-api`'s `ai-train=yes` was published
without a recorded ratification, and whether it stands is still an open question
for the product owner. This decision covers `www`.

## A consideration, not a blocker: `llms.txt`

`www` serves [`/llms.txt`](https://www.thenational.academy/llms.txt) while
declaring `ai-input=no`, which reads at first like the site arguing with itself.

It is consistent on the intended reading. `llms.txt` is a signpost, not content:
it exists to tell an agent what Oak is and to point it at the sanctioned
machine-readable surfaces — the curriculum API and the MCP server — rather than
to be the material an answer is grounded on. "Do not ground on my pages, use my
API" is a coherent posture, and it is the one Oak is taking.

The honest edge, recorded rather than resolved: a crawler honouring `ai-input=no`
across the host might decline to read `llms.txt` itself, since the signal covers
the host rather than nominating exceptions. Neither Content Signals nor the
AIPREF draft has a way to say "this file is an exception". Worth watching as the
vocabulary matures; not worth changing a value over.

## Standards status

Content Signals is a Cloudflare policy, launched 24 September 2025, and is not a
standard. The IETF work that will supersede it, `draft-ietf-aipref-vocab`, is at
`-07` (19 August 2026) on the Proposed Standard track and defines `train-ai` and
`search` categories. It is not yet an RFC. Revisit this file when it lands.
