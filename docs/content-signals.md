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
output. This is deliberate. A transform that quietly returned the input
unchanged would publish a `robots.txt` with no declaration in it at all, and the
build, the deploy and every other check would still pass.
`src/tests/e2e/robots/content-signal.spec.ts` then asserts the directive on the
served file, and asserts its position, not merely its presence — a directive
outside the group applies to nobody.

## Why the hosts differ, deliberately

Oak's public hosts do not all declare the same thing, and that is policy rather
than drift. Measured 9 September 2026:

| Host                           | `robots.txt` | `Content-Signal`                         |
| ------------------------------ | ------------ | ---------------------------------------- |
| `www.thenational.academy`      | 200          | `ai-train=no, search=yes, ai-input=no`   |
| `open-api.thenational.academy` | 200          | `ai-train=yes, search=yes, ai-input=yes` |
| `mcp.thenational.academy`      | 404          | none — the host serves no `robots.txt`   |

The two differ because what they serve differs. `www` carries Oak's own
copyrighted site content, so it declines both training and grounding. The
curriculum API serves material published under the Open Government Licence,
where `ai-train=yes` is the coherent position. Two hosts, two licences, two
policies.

Aakash settled the `www` values, relayed by MG on 10 September 2026:

> On content signals -> I think it's probably sensible to take the approach of
> ai-train=no, search=yes, and ai-input=no. This makes sense for the main site
> which has content that is copyrighted.

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
