import { getSharingMetadata } from "./getSharingMetadata";

describe("getSharingMetadata", () => {
  it("generates sharing metadata for copy", () => {
    const result = getSharingMetadata({
      medium: "copy-link",
      selectedActivities: ["exit-quiz-questions", "video"],
      lessonSlug: "lesson-slug",
    });

    expect(result.link).toBe(
      "https://classroom.thenational.academy/lessons/lesson-slug?utm_campaign=sharing-button&activities=exit-quiz-questions+video&utm_medium=copy-link",
    );
  });
  it("generates sharing metadata for facebook", () => {
    const result = getSharingMetadata({
      medium: "social",
      network: "facebook",
      lessonSlug: "lesson-slug",
    });

    expect(result.link).toBe(
      "https://classroom.thenational.academy/lessons/lesson-slug?utm_campaign=sharing-button&utm_source=facebook&utm_medium=social",
    );
    expect(result.urlEncodedLink).toBe(
      "https%3A%2F%2Fclassroom.thenational.academy%2Flessons%2Flesson-slug%3Futm_campaign%3Dsharing-button%26utm_source%3Dfacebook%26utm_medium%3Dsocial",
    );
  });
  it("includes activities when provided", () => {
    const result = getSharingMetadata({
      medium: "social",
      network: "facebook",
      lessonSlug: "lesson-slug",
      selectedActivities: ["exit-quiz-questions", "video"],
    });
    expect(result.link).toContain("activities=exit-quiz-questions+video");
  });
});
