import { buildReviewAttemptData } from "./buildReviewAttemptData";

describe("buildReviewAttemptData", () => {
  it("builds persisted attempt data from lesson metadata and section results", () => {
    expect(
      buildReviewAttemptData({
        lessonSlug: "slug",
        lessonTitle: "title",
        subject: "Maths",
        yearDescription: "Year 7",
        sectionResults: { intro: { isComplete: true } },
      }),
    ).toEqual({
      lessonData: { slug: "slug", title: "title" },
      browseData: { subject: "Maths", yearDescription: "Year 7" },
      sectionResults: { intro: { isComplete: true } },
    });
  });

  it("defaults missing year descriptions to an empty string", () => {
    expect(
      buildReviewAttemptData({
        lessonSlug: "slug",
        lessonTitle: "title",
        subject: "Maths",
        yearDescription: null,
        sectionResults: {},
      }).browseData.yearDescription,
    ).toBe("");
  });
});
