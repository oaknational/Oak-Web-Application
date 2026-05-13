import { buildReviewShareUrl } from "./buildReviewShareUrl";

describe("buildReviewShareUrl", () => {
  it("builds a share url for a lesson attempt", () => {
    expect(
      buildReviewShareUrl({ lessonSlug: "lesson", attemptId: "attempt" }),
    ).toContain("/pupils/lessons/lesson/results/attempt/share");
  });
});
