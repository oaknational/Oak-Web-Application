/**
 * @jest-environment node
 */
import { GET } from "@/app/api/teachers/lessons/[lessonSlug]/markdown/route";
import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import OakError from "@/errors/OakError";

const lessonOverview = jest.fn();

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    lessonOverview: (...args: unknown[]) => lessonOverview(...args),
  },
}));

const request = new Request(
  "https://www.thenational.academy/teachers/lessons/photosynthesis.md",
);

describe("/teachers/lessons/[lessonSlug].md", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  it("sets a shared-cache lifetime so the CDN can serve it", async () => {
    lessonOverview.mockResolvedValue(lessonOverviewFixture());

    const response = await GET(request, {
      params: Promise.resolve({ lessonSlug: "photosynthesis" }),
    });

    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=300, stale-while-revalidate=86400",
    );
  });

  it("does not send Vary, because this URL always returns markdown", async () => {
    lessonOverview.mockResolvedValue(lessonOverviewFixture());

    const response = await GET(request, {
      params: Promise.resolve({ lessonSlug: "photosynthesis" }),
    });

    expect(response.headers.get("Vary")).toBeNull();
  });

  it("responds 404 when the curriculum API has no such lesson", async () => {
    lessonOverview.mockRejectedValue(
      new OakError({ code: "curriculum-api/not-found" }),
    );

    const response = await GET(request, {
      params: Promise.resolve({ lessonSlug: "no-such-lesson" }),
    });

    expect(response.status).toBe(404);
    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8",
    );
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
