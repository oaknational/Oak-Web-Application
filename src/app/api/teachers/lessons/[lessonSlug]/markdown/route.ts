/**
 * Markdown representation of a teacher lesson overview.
 *
 * Served at `/teachers/lessons/<lessonSlug>.md` via a rewrite in
 * `next.config.ts`, and advertised from the lesson page with an RFC 8288
 * `Link: …; rel="alternate"; type="text/markdown"` header.
 *
 * @see docs/agent-readable-lesson-pages.md — why this is a distinct URL rather
 *   than `Accept` negotiation, why nothing here sets `Vary: Accept`, and the
 *   cache measurements behind the directives below.
 */
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { lessonToMarkdown } from "@/utils/lessonToMarkdown";
import { allowNotFoundError } from "@/pages-helpers/shared/lesson-pages/allowNotFoundError";
import { getRedirect } from "@/pages-helpers/shared/lesson-pages/getRedirects";

const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8";

/**
 * Cache directives, stated once per layer. `CDN-Cache-Control` is not redundant:
 * Vercel strips `s-maxage` and `stale-while-revalidate` from `Cache-Control`
 * before forwarding, so a downstream CDN would otherwise see a bare `public`.
 *
 * `sharedTransient` carries no `stale-while-revalidate` on purpose — a "not
 * found" must never be served stale once it has stopped being true.
 *
 * @see docs/agent-readable-lesson-pages.md for the measurements, and for where
 *   the 300 does and does not come from.
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
    // lesson page and the media page both do.
    let redirect;
    try {
      redirect = await getRedirect({
        isCanonical: true,
        context: { lessonSlug },
        isTeacher: true,
        isLesson: true,
      });
    } catch (error) {
      // `canonicalLessonRedirectQuery` throws `curriculum-api/not-found` when
      // the table holds no row, rather than returning nothing — the ordinary
      // case for a slug that never existed.
      allowNotFoundError(error);
    }

    if (redirect) {
      // Next's `Redirect` carries the status either as a code or as a
      // permanence flag, so both members are handled.
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
