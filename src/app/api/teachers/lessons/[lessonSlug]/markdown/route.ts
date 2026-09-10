/**
 * Markdown representation of a teacher lesson overview.
 *
 * Served at `/teachers/lessons/<lessonSlug>.md` via a rewrite in
 * `next.config.ts`, and advertised from the lesson page itself with an
 * RFC 8288 `Link: …; rel="alternate"; type="text/markdown"` header.
 *
 * This is a distinct URL rather than `Accept: text/markdown` negotiation on the
 * lesson page. Negotiation is the better end state — one round trip, and the
 * canonical URL stays canonical — but it requires every cache in front of the
 * app to key on `Accept`, and measured against production neither layer does:
 * Cloudflare's default cache key carries no `Accept` header, and Vercel's CDN
 * served one stored entry for three different `Accept` values on this route
 * despite documenting that `Accept` is in its key by default. A distinct URL is
 * a distinct cache key at every layer, so it needs no `Vary` and cannot mix
 * representations — which is also how Next.js separates its own flight payload
 * on this route, at `/teachers/lessons/[lessonSlug].rsc`. See
 * `docs/agent-readable-lesson-pages.md` for the measurements, the control
 * probes behind them, and the plan to add negotiation on top of this handler.
 *
 * Deliberately no `Vary` header: this URL always returns markdown regardless of
 * what the request asked for, so listing `Accept` in `Vary` would be false.
 * `Vary: Accept` belongs on the negotiated lesson page, not here.
 */
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { lessonToMarkdown } from "@/utils/lessonToMarkdown";
import { allowNotFoundError } from "@/pages-helpers/shared/lesson-pages/allowNotFoundError";
import { getRedirect } from "@/pages-helpers/shared/lesson-pages/getRedirects";

const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8";

/**
 * Cache directives, stated separately for each layer that has one.
 *
 * **Where the 300 comes from.** It is a deliberate five-minute shared-cache
 * window for this handler, and not a number inherited from the lesson page. It
 * is worth stating that explicitly, because the obvious-looking provenance is
 * wrong: the canonical lesson URL emits no `x-nextjs-stale-time` at all.
 * Measured against production on 2026-09-10,
 * `/teachers/lessons/adverbial-complex-sentences` answered
 * `cache-control: public, max-age=0, must-revalidate` with no `x-nextjs-…`
 * header of any kind — it is a Pages Router route
 * (`src/pages/teachers/lessons/[lessonSlug].tsx`), and its own regeneration
 * window is the ISR `revalidate` fed from `SANITY_REVALIDATE_SECONDS`, which
 * never appears in a response header. The route that *does* answer
 * `x-nextjs-stale-time: 300` is the App Router programme-scoped lesson route
 * (`/teachers/programmes/[slug]/units/[unitSlug]/lessons/[lessonSlug]`), where
 * the 300 is this app's own `experimental.staleTimes.static` from
 * `next.config.ts` — a CLIENT router-cache prefetch lifetime, not a
 * shared-cache revalidation window, and not a setting the Pages Router lesson
 * page is subject to. `docs/agent-readable-lesson-pages.md` already records the
 * same measurement.
 *
 * So five minutes is chosen here on its own merits: short relative to how
 * rarely lesson content changes, with a long stale window on top so a shared
 * cache can serve while it revalidates.
 *
 * `CDN-Cache-Control` is not redundant with `Cache-Control` here. Vercel strips
 * `s-maxage` and `stale-while-revalidate` from `Cache-Control` before sending
 * the response on, so a downstream CDN — and `www` has Cloudflare in front of
 * Vercel — would otherwise receive a bare `public` with no freshness lifetime
 * and fall back to its own heuristics. Measured on a preview deployment before
 * this header was added: the response reached the client as
 * `cache-control: public`.
 *
 * The browser directive deliberately matches the lesson page's own
 * (`public, max-age=0, must-revalidate`, measured above) so the two
 * representations behave consistently in a client cache.
 *
 * **The miss window is separate, and short.** `<slug>.md` is trivially
 * enumerable — anyone can append `.md` to any slug they can invent — so a
 * response that sets no cache headers at all puts every miss through to the
 * curriculum API. Sixty seconds of shared caching blunts that, and it carries
 * no `stale-while-revalidate` deliberately: a "not found" must never be served
 * from a stale entry once it has stopped being true, so a newly published
 * lesson cannot sit behind a cached 404 for longer than that minute. The
 * redirect responses take the same window for the same reason.
 */
const CACHE_CONTROL = {
  browser: "public, max-age=0, must-revalidate",
  shared: "public, s-maxage=300, stale-while-revalidate=86400",
  sharedTransient: "public, s-maxage=60",
} as const;

/** A canonical lesson path with no suffix, as the redirect table emits it. */
const CANONICAL_LESSON_PATH = /^\/teachers\/lessons\/[^/?#]+$/;

/**
 * Points a redirect destination at the markdown representation rather than the
 * HTML one, so `<old>.md` lands on `<new>.md` instead of dropping a markdown
 * consumer into a page it did not ask for.
 *
 * A destination that is not a bare canonical lesson path is passed through
 * untouched — a correct redirect to the page beats a URL assembled from a shape
 * this function does not recognise.
 */
function toMarkdownDestination(destination: string): string {
  const suffixStart = destination.search(/[?#]/);
  const path =
    suffixStart === -1 ? destination : destination.slice(0, suffixStart);
  const suffix = suffixStart === -1 ? "" : destination.slice(suffixStart);

  return CANONICAL_LESSON_PATH.test(path) ? `${path}.md${suffix}` : destination;
}

/**
 * The transient-cache headers shared by the miss responses: a 404 and a
 * redirect are both answers to a URL anyone can enumerate.
 */
const TRANSIENT_CACHE_HEADERS = {
  "Cache-Control": CACHE_CONTROL.browser,
  "CDN-Cache-Control": CACHE_CONTROL.sharedTransient,
  "Vercel-CDN-Cache-Control": CACHE_CONTROL.sharedTransient,
} as const;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lessonSlug: string }> },
) {
  const { lessonSlug } = await params;

  let lesson;
  try {
    lesson = await curriculumApi2023.lessonOverview({ lessonSlug });
  } catch (error) {
    // A missing lesson is a 404, not a 500. Any other failure is a real error
    // and is rethrown so it reaches the error reporter.
    allowNotFoundError(error);
  }

  if (!lesson) {
    // Consult the canonical redirect table before giving up, exactly as the
    // lesson page and the media page both do. Without this step a renamed slug
    // redirects on the HTML URL and 404s on the `.md` one.
    let redirect;
    try {
      redirect = await getRedirect({
        isCanonical: true,
        context: { lessonSlug },
        isTeacher: true,
        isLesson: true,
      });
    } catch (error) {
      // `canonicalLessonRedirectQuery` THROWS `curriculum-api/not-found` when
      // the table holds no row for this path, rather than returning nothing —
      // which is the ordinary case for a slug that never existed. Anything else
      // is a real failure and is rethrown.
      allowNotFoundError(error);
    }

    if (redirect) {
      // `getRedirect` returns Next's `Redirect`, whose two members carry the
      // status either as a code or as a permanence flag. Both are handled, so
      // this does not depend on which shape the redirect table produced.
      const status =
        "statusCode" in redirect
          ? redirect.statusCode
          : redirect.permanent
            ? 308
            : 307;

      return new Response(null, {
        status,
        headers: {
          Location: toMarkdownDestination(redirect.destination),
          ...TRANSIENT_CACHE_HEADERS,
        },
      });
    }

    return new Response("Lesson not found\n", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        ...TRANSIENT_CACHE_HEADERS,
      },
    });
  }

  return new Response(lessonToMarkdown(lesson), {
    status: 200,
    headers: {
      "Content-Type": MARKDOWN_CONTENT_TYPE,
      "Cache-Control": CACHE_CONTROL.browser,
      "CDN-Cache-Control": CACHE_CONTROL.shared,
      "Vercel-CDN-Cache-Control": CACHE_CONTROL.shared,
    },
  });
}
