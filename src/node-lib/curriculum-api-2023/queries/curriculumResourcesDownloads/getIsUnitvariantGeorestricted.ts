import sdk from "../../sdk";

import unitvariantLessonsByIdQuery from "./getIsUnitvaraintGeorestricted.query";

describe("unitvariantLessonsByIdQuery", () => {
  it("throws error for invalid unitProgrammeSlug format (no hyphen)", async () => {
    await expect(
      unitvariantLessonsByIdQuery(sdk)({ unitProgrammeSlug: "nohyphenhere" }),
    ).rejects.toThrow("Invalid unitProgrammeSlug format");
  });

  it("throws error when unitvariantId is not a number", async () => {
    await expect(
      unitvariantLessonsByIdQuery(sdk)({
        unitProgrammeSlug: "some-slug-notanumber",
      }),
    ).rejects.toThrow("Invalid unitvariantId extracted from unitProgrammeSlug");
  });

  it("returns false when no lessons found", async () => {
    const result = await unitvariantLessonsByIdQuery({
      ...sdk,
      unitvariantLessonsById: jest.fn(() =>
        Promise.resolve({ unitvariant_lessons: [] }),
      ),
    })({ unitProgrammeSlug: "unit-slug-123" });

    expect(result).toBe(false);
  });

  it("returns false when no lessons are geo-restricted", async () => {
    const result = await unitvariantLessonsByIdQuery({
      ...sdk,
      unitvariantLessonsById: jest.fn(() =>
        Promise.resolve({
          unitvariant_lessons: [
            { lesson: { features: { agf__geo_restricted: false } } },
            { lesson: { features: { agf__geo_restricted: false } } },
          ],
        }),
      ),
    })({ unitProgrammeSlug: "unit-slug-123" });

    expect(result).toBe(false);
  });

  it("returns true when any lesson is geo-restricted", async () => {
    const result = await unitvariantLessonsByIdQuery({
      ...sdk,
      unitvariantLessonsById: jest.fn(() =>
        Promise.resolve({
          unitvariant_lessons: [
            { lesson: { features: { agf__geo_restricted: false } } },
            { lesson: { features: { agf__geo_restricted: true } } },
            { lesson: { features: { agf__geo_restricted: false } } },
          ],
        }),
      ),
    })({ unitProgrammeSlug: "unit-slug-456" });

    expect(result).toBe(true);
  });

  it("handles lessons with null features", async () => {
    const result = await unitvariantLessonsByIdQuery({
      ...sdk,
      unitvariantLessonsById: jest.fn(() =>
        Promise.resolve({
          unitvariant_lessons: [
            { lesson: { features: null } },
            { lesson: null },
          ],
        }),
      ),
    })({ unitProgrammeSlug: "unit-slug-789" });

    expect(result).toBe(false);
  });

  it("extracts unitvariantId correctly from slug", async () => {
    const mockFn = jest.fn(() => Promise.resolve({ unitvariant_lessons: [] }));

    await unitvariantLessonsByIdQuery({
      ...sdk,
      unitvariantLessonsById: mockFn,
    })({ unitProgrammeSlug: "my-unit-name-12345" });

    expect(mockFn).toHaveBeenCalledWith({ unitvariantId: 12345 });
  });

  it("handles slug with multiple hyphens correctly", async () => {
    const mockFn = jest.fn(() => Promise.resolve({ unitvariant_lessons: [] }));

    await unitvariantLessonsByIdQuery({
      ...sdk,
      unitvariantLessonsById: mockFn,
    })({ unitProgrammeSlug: "my-complex-unit-name-with-many-parts-99" });

    expect(mockFn).toHaveBeenCalledWith({ unitvariantId: 99 });
  });
});
