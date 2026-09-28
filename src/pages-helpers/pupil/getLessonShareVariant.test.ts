import {
  getLessonShareVariant,
  getLessonShareVariantSlug,
} from "./getLessonShareVariant";

describe("getLessonShareVariant", () => {
  it("returns the matching lesson share variant", () => {
    expect(getLessonShareVariant("starter-quiz-only")).toEqual({
      sections: ["overview", "intro", "starter-quiz"],
      reviewSections: ["intro", "starter-quiz"],
    });
  });

  it("returns null for an unknown variant", () => {
    expect(getLessonShareVariant("not-a-variant")).toBeNull();
  });
});

describe("getLessonShareVariantSlug", () => {
  it("returns the matching slug from selected lesson sections", () => {
    expect(
      getLessonShareVariantSlug(["overview", "intro", "starter-quiz"]),
    ).toBe("starter-quiz-only");
  });

  it("returns null when no variant matches exactly", () => {
    expect(getLessonShareVariantSlug(["overview", "intro"])).toBeNull();
  });

  it("returns the matching slug from selected lesson sections and year group", () => {
    expect(
      getLessonShareVariantSlug(["overview", "intro", "starter-quiz"], true),
    ).toBe("starter-quiz-only-no-year");
  });

  it("returns full lesson slug when all sections and year group", () => {
    expect(
      getLessonShareVariantSlug(
        ["overview", "intro", "starter-quiz", "video", "exit-quiz"],
        true,
      ),
    ).toBe("full-no-year");
  });
});
