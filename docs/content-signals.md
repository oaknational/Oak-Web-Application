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

The value was authorised by the product owner on 9 September 2026.

## How it is served

`robots.txt` is generated at build time by `next-sitemap`, from
`next-sitemap.config.js`, and written into `public/` by the `postbuild` script.

next-sitemap's robots builder emits only `Allow`, `Disallow` and `Crawl-delay`
for each policy group, so there is no configuration key for this directive. It
is injected by the `transformRobotsTxt` hook, which is next-sitemap's supported
extension point for exactly this.

That hook throws if the `User-agent: *` group is missing from the generated
output. This is deliberate. A transform that quietly returned the input
unchanged would publish a `robots.txt` with no declaration in it at all, and the
build, the deploy and every other check would still pass.
`src/tests/e2e/robots/content-signal.spec.ts` then asserts the directive on the
served file, and asserts its position, not merely its presence — a directive
outside the group applies to nobody.

## Open question: the estate does not yet say one thing

These values are not yet consistent across Oak's public hosts. Measured
9 September 2026:

| Host                           | `robots.txt` | `Content-Signal`                         |
| ------------------------------ | ------------ | ---------------------------------------- |
| `www.thenational.academy`      | 200          | this document                            |
| `open-api.thenational.academy` | 200          | `ai-train=yes, search=yes, ai-input=yes` |
| `mcp.thenational.academy`      | 404          | none — the host serves no `robots.txt`   |

So Oak declares `ai-train=no` here and `ai-train=yes` on the curriculum API, at
the same time, on the same signal.

There is a second tension within this host. `www` serves
[`/llms.txt`](https://www.thenational.academy/llms.txt), a file whose only
purpose is to describe Oak's content to language models, while `ai-input=no`
asks those same models not to use the content as input.

Both may turn out to be deliberate. Oak's curriculum is published under the Open
Government Licence, and a publisher can coherently open an API for machine use
while asking that its website not be scraped for the same purpose. That case has
not been made and recorded anywhere, though, and until it is, the estate reads as
inconsistent rather than as considered.

Tracked as `MCP-714`. The question owed is not whether to adopt Content Signals,
but whether the published values are Oak's and whether every host should say the
same thing.

## Standards status

Content Signals is a Cloudflare policy, launched 24 September 2025, and is not a
standard. The IETF work that will supersede it, `draft-ietf-aipref-vocab`, is at
`-07` (19 August 2026) on the Proposed Standard track and defines `train-ai` and
`search` categories. It is not yet an RFC. Revisit this file when it lands.
