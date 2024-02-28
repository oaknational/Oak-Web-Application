import { getSharingMetadata } from "./getSharingMetadata";
import { shareLinkConfig } from "./linkConfig";

describe("getSharingMetadata", () => {
  it("generates sharing metadata for copy", () => {
    const result = getSharingMetadata({
      selectedActivities: ["exit-quiz-questions", "video"],
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.copy,
      usePupils: false,
    });

    expect(result.link).toBe(
      "https://classroom.thenational.academy/lessons/lesson-slug?utm_campaign=sharing-button&activities=exit_quiz+video&utm_medium=copy-link",
    );
  });
  it("generates sharing metadata for microsoft teams", () => {
    const result = getSharingMetadata({
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.microsoftTeams,
      usePupils: false,
    });

    expect(result.link).toBe(
      "https://classroom.thenational.academy/lessons/lesson-slug?utm_campaign=sharing-button&utm_source=microsoft-teams&utm_medium=lms",
    );
    expect(result.urlEncodedLink).toBe(
      "https%3A%2F%2Fclassroom.thenational.academy%2Flessons%2Flesson-slug%3Futm_campaign%3Dsharing-button%26utm_source%3Dmicrosoft-teams%26utm_medium%3Dlms",
    );
  });
  it("includes activities when provided", () => {
    const result = getSharingMetadata({
      lessonSlug: "lesson-slug",
      selectedActivities: ["exit-quiz-questions", "video"],
      linkConfig: shareLinkConfig.copy,
      usePupils: false,
    });
    expect(result.link).toContain("activities=exit_quiz+video");
  });
  it("uses the correct url for the new pupils experience", () => {
    const result = getSharingMetadata({
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.copy,
      usePupils: true,
    });
    expect(result.link).toBe(
      "https://thenational.academy/pupils/lessons/lesson-slug?share=true",
    );
  });
});
