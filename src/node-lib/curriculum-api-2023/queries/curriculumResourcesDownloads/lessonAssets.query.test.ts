import sdk from "../../sdk";

import lessonAssetsQuery from "./lessonAssets.query";

describe("lessonAssetsQuery", () => {
  it("returns null when no lesson is found", async () => {
    const result = await lessonAssetsQuery({
      ...sdk,
      lessonAssets: jest.fn(() => Promise.resolve({ lessons: [] })),
    })({ lessonSlug: "non-existent-lesson" });

    expect(result).toBeNull();
  });

  it("returns lesson assets with geo-restriction flags set to false when features are missing", async () => {
    const mockLesson = {
      slug: "test-lesson",
      features: null,
      asset_slidedeck: null,
      asset_worksheet: null,
      asset_worksheet_answers: null,
      asset_supplementary_asset: null,
      quiz_starter: null,
      quiz_exit: null,
      asset_lesson_guide: null,
      tpc_downloadablefiles: [],
    };

    const result = await lessonAssetsQuery({
      ...sdk,
      lessonAssets: jest.fn(() =>
        Promise.resolve({
          lessons: [mockLesson],
        }),
      ),
    })({ lessonSlug: "test-lesson" });

    expect(result).toBeDefined();
    expect(result?.lesson.slug).toBe("test-lesson");
    expect(result?.isGeoRestricted).toBe(false);
    expect(result?.isLoginRequired).toBe(false);
  });

  it("correctly identifies geo-restricted lessons", async () => {
    const mockLesson = {
      slug: "geo-restricted-lesson",
      features: {
        agf__geo_restricted: true,
        agf__login_required: true,
      },
      asset_slidedeck: null,
      asset_worksheet: null,
      asset_worksheet_answers: null,
      asset_supplementary_asset: null,
      quiz_starter: null,
      quiz_exit: null,
      asset_lesson_guide: null,
      tpc_downloadablefiles: [],
    };

    const result = await lessonAssetsQuery({
      ...sdk,
      lessonAssets: jest.fn(() =>
        Promise.resolve({
          lessons: [mockLesson],
        }),
      ),
    })({ lessonSlug: "geo-restricted-lesson" });

    expect(result?.isGeoRestricted).toBe(true);
    expect(result?.isLoginRequired).toBe(true);
  });

  it("throws error when lesson data fails schema validation", async () => {
    const invalidLesson = {
      // missing required 'slug' field
      features: null,
    };

    await expect(
      lessonAssetsQuery({
        ...sdk,
        lessonAssets: jest.fn(() =>
          Promise.resolve({
            lessons: [invalidLesson],
          }),
        ),
      })({ lessonSlug: "invalid-lesson" }),
    ).rejects.toThrow("Failed to parse lesson assets from curriculum API");
  });
});
