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

const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8";

/**
 * Cache directives, stated separately for each layer that has one.
 *
 * The shared-cache window mirrors the lesson page's own revalidation window
 * (the page responds with `x-nextjs-stale-time: 300`) so the two
 * representations do not drift far apart, with a long stale window because
 * lesson content changes rarely.
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
 * (`public, max-age=0, must-revalidate`) so the two representations behave
 * consistently in a client cache.
 */
const CACHE_CONTROL = {
  browser: "public, max-age=0, must-revalidate",
  shared: "public, s-maxage=300, stale-while-revalidate=86400",
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
    return new Response("Lesson not found\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
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
