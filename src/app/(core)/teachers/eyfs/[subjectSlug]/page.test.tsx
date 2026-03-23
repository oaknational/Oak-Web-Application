import EyfsPage from "./page";

const featureFlagMock = jest.fn().mockResolvedValue(false);
jest.mock("@/utils/featureFlags", () => ({
  getFeatureFlagValue: () => featureFlagMock(),
}));

jest.unmock("next/navigation");

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    eyfsPage: () =>
      jest.fn().mockResolvedValue({
        subjectTitle: "Maths",
        units: [
          {
            title: "Unit 1",
            lessons: [
              {
                slug: "lesson-2",
                title: "Lesson 2",
                video: { muxPlaybackId: "video-2", title: "Video 2" },
                orderInUnit: 2,
              },
              {
                slug: "lesson-1",
                title: "Lesson 1",
                video: { muxPlaybackId: "video-1", title: "Video 1" },
                orderInUnit: 1,
              },
            ],
          },
        ],
        subjectTabs: [],
      })(),
  },
}));

describe("Eyfs page", () => {
  it("renders 404 page if feature flag is disabled", async () => {
    await expect(
      EyfsPage({
        params: Promise.resolve({
          subjectSlug: "maths",
        }),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
  it("renders when feature flag is enabled", async () => {
    featureFlagMock.mockResolvedValue(true);
    const result = await EyfsPage({
      params: Promise.resolve({
        subjectSlug: "maths-primary",
      }),
    });

    expect(result).toBeDefined();
  });
});
