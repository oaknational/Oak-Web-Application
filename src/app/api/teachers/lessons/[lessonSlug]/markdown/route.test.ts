/**
 * @jest-environment node
 */
import { GET } from "@/app/api/teachers/lessons/[lessonSlug]/markdown/route";
import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import OakError from "@/errors/OakError";

const lessonOverview = jest.fn();
const getRedirect = jest.fn();

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    lessonOverview: (...args: unknown[]) => lessonOverview(...args),
  },
}));

jest.mock("@/pages-helpers/shared/lesson-pages/getRedirects", () => ({
  getRedirect: (...args: unknown[]) => getRedirect(...args),
}));

const notFound = () => new OakError({ code: "curriculum-api/not-found" });

const request = new Request(
  "https://www.thenational.academy/teachers/lessons/photosynthesis.md",
);

describe("/teachers/lessons/[lessonSlug].md", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // The real `canonicalLessonRedirectQuery` throws `curriculum-api/not-found`
    // when the table holds no row, so that — not `undefined` — is the default
    // this suite runs against.
    getRedirect.mockRejectedValue(notFound());
  });

  it("responds 200 with the text/markdown content type", async () => {
    lessonOverview.mockResolvedValue(lessonOverviewFixture());

    const response = await GET(request, {
      params: Promise.resolve({ lessonSlug: "photosynthesis" }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "text/markdown; charset=utf-8",
    );
  });

  it("looks the lesson up by the slug in the route params", async () => {
    lessonOverview.mockResolvedValue(lessonOverviewFixture());

    await GET(request, {
      params: Promise.resolve({ lessonSlug: "photosynthesis" }),
    });

    expect(lessonOverview).toHaveBeenCalledWith({
      lessonSlug: "photosynthesis",
    });
  });

  it("returns the lesson serialised as markdown", async () => {
    lessonOverview.mockResolvedValue(
      lessonOverviewFixture({
        lessonSlug: "photosynthesis",
        lessonTitle: "Photosynthesis",
      }),
    );

    const response = await GET(request, {
      params: Promise.resolve({ lessonSlug: "photosynthesis" }),
    });
    const body = await response.text();

    expect(body).toContain('title: "Photosynthesis"');
    expect(body).toContain("# Photosynthesis");
  });

  it("states a cache directive for every layer that has one", async () => {
    lessonOverview.mockResolvedValue(lessonOverviewFixture());

    const response = await GET(request, {
      params: Promise.resolve({ lessonSlug: "photosynthesis" }),
    });

    // Browsers revalidate, matching the lesson page's own posture.
    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=0, must-revalidate",
    );
    // Shared caches get an explicit lifetime. `CDN-Cache-Control` is the one a
    // downstream CDN sees, because Vercel strips `s-maxage` from
    // `Cache-Control` before forwarding the response.
    expect(response.headers.get("CDN-Cache-Control")).toBe(
      "public, s-maxage=300, stale-while-revalidate=86400",
    );
    expect(response.headers.get("Vercel-CDN-Cache-Control")).toBe(
      "public, s-maxage=300, stale-while-revalidate=86400",
    );
  });

  /**
   * The claim that this URL sends no `Vary` is NOT asserted here.
   *
   * Reading `Vary` back off the `Response` this handler builds proves nothing:
   * the handler contains no code that could set it, so the assertion holds by
   * construction and would still hold if a `Vary` rule appeared in
   * `next.config.ts` tomorrow. The header rules are the other half of what a
   * client receives on this URL, so that is where the claim can fail — see
   * `src/__tests__/lesson-markdown-headers.test.ts`.
   *
   * What IS a real property of the handler is the exact set of headers it
   * chooses to send, so that is what this pins.
   */
  it("sends exactly the headers it means to, and nothing else", async () => {
    lessonOverview.mockResolvedValue(lessonOverviewFixture());

    const response = await GET(request, {
      params: Promise.resolve({ lessonSlug: "photosynthesis" }),
    });

    expect([...response.headers.keys()].sort()).toEqual([
      "cache-control",
      "cdn-cache-control",
      "content-type",
      "vercel-cdn-cache-control",
    ]);
  });

  it("responds 404 when the curriculum API has no such lesson and no redirect exists", async () => {
    lessonOverview.mockRejectedValue(notFound());

    const response = await GET(request, {
      params: Promise.resolve({ lessonSlug: "no-such-lesson" }),
    });

    expect(response.status).toBe(404);
    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8",
    );
  });

  /**
   * `<slug>.md` is trivially enumerable, so a 404 that sets no cache headers
   * puts every invented slug through to the curriculum API. The window is
   * short and carries no `stale-while-revalidate`, so a newly published lesson
   * cannot sit behind a cached 404.
   */
  it("caches the 404 briefly, and never staler than it is true", async () => {
    lessonOverview.mockRejectedValue(notFound());

    const response = await GET(request, {
      params: Promise.resolve({ lessonSlug: "no-such-lesson" }),
    });

    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=0, must-revalidate",
    );
    expect(response.headers.get("CDN-Cache-Control")).toBe(
      "public, s-maxage=60",
    );
    expect(response.headers.get("Vercel-CDN-Cache-Control")).toBe(
      "public, s-maxage=60",
    );
    expect(response.headers.get("CDN-Cache-Control")).not.toContain(
      "stale-while-revalidate",
    );
  });

  describe("a renamed lesson slug", () => {
    /**
     * The lesson page and the media page both consult the canonical redirect
     * table before returning `notFound`. Without the same step here a renamed
     * lesson redirects on the HTML URL and 404s on the `.md` one.
     */
    it("follows the canonical redirect table, keyed on the requested slug", async () => {
      lessonOverview.mockRejectedValue(notFound());
      getRedirect.mockResolvedValue({
        destination: "/teachers/lessons/new-slug?redirected=true",
        statusCode: 308,
        basePath: false,
      });

      const response = await GET(request, {
        params: Promise.resolve({ lessonSlug: "old-slug" }),
      });

      expect(getRedirect).toHaveBeenCalledWith({
        isCanonical: true,
        context: { lessonSlug: "old-slug" },
        isTeacher: true,
        isLesson: true,
      });
      expect(response.status).toBe(308);
    });

    it("redirects to the markdown representation, not the HTML page", async () => {
      lessonOverview.mockRejectedValue(notFound());
      getRedirect.mockResolvedValue({
        destination: "/teachers/lessons/new-slug?redirected=true",
        statusCode: 308,
        basePath: false,
      });

      const response = await GET(request, {
        params: Promise.resolve({ lessonSlug: "old-slug" }),
      });

      expect(response.headers.get("Location")).toBe(
        "/teachers/lessons/new-slug.md?redirected=true",
      );
    });

    it("carries the temporary status through when the table says 307", async () => {
      lessonOverview.mockRejectedValue(notFound());
      getRedirect.mockResolvedValue({
        destination: "/teachers/lessons/new-slug",
        statusCode: 307,
        basePath: false,
      });

      const response = await GET(request, {
        params: Promise.resolve({ lessonSlug: "old-slug" }),
      });

      expect(response.status).toBe(307);
      expect(response.headers.get("Location")).toBe(
        "/teachers/lessons/new-slug.md",
      );
    });

    it("passes a destination outside the canonical lesson path through unchanged", async () => {
      lessonOverview.mockRejectedValue(notFound());
      getRedirect.mockResolvedValue({
        destination: "/teachers/programmes/maths-primary/units/fractions",
        statusCode: 308,
        basePath: false,
      });

      const response = await GET(request, {
        params: Promise.resolve({ lessonSlug: "old-slug" }),
      });

      expect(response.headers.get("Location")).toBe(
        "/teachers/programmes/maths-primary/units/fractions",
      );
    });

    it("caches the redirect on the same short window as the 404", async () => {
      lessonOverview.mockRejectedValue(notFound());
      getRedirect.mockResolvedValue({
        destination: "/teachers/lessons/new-slug",
        statusCode: 308,
        basePath: false,
      });

      const response = await GET(request, {
        params: Promise.resolve({ lessonSlug: "old-slug" }),
      });

      expect(response.headers.get("CDN-Cache-Control")).toBe(
        "public, s-maxage=60",
      );
    });

    it("rethrows a redirect-table failure that is not a missing row", async () => {
      lessonOverview.mockRejectedValue(notFound());
      getRedirect.mockRejectedValue(new Error("redirect table exploded"));

      await expect(
        GET(request, {
          params: Promise.resolve({ lessonSlug: "old-slug" }),
        }),
      ).rejects.toThrow("redirect table exploded");
    });

    it("does not consult the redirect table for a lesson that exists", async () => {
      lessonOverview.mockResolvedValue(lessonOverviewFixture());

      await GET(request, {
        params: Promise.resolve({ lessonSlug: "photosynthesis" }),
      });

      expect(getRedirect).not.toHaveBeenCalled();
    });
  });

  it("rethrows an unexpected curriculum API failure rather than serving a 404", async () => {
    lessonOverview.mockRejectedValue(new Error("upstream exploded"));

    await expect(
      GET(request, {
        params: Promise.resolve({ lessonSlug: "photosynthesis" }),
      }),
    ).rejects.toThrow("upstream exploded");
  });
});
