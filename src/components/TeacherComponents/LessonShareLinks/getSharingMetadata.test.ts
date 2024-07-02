import { getSharingMetadata } from "./getSharingMetadata";
import { shareLinkConfig } from "./linkConfig";

describe("getSharingMetadata", () => {
  it("generates sharing metadata for copy", () => {
    const result = getSharingMetadata({
      selectedActivities: ["exit-quiz-questions", "video"],
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.copy,
    });

    expect(result.link).toBe(
      "https://thenational.academy/pupils/lessons/lesson-slug?share=true",
    );
  });
  it("generates sharing metadata for microsoft teams", () => {
    const result = getSharingMetadata({
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.microsoftTeams,
    });

    expect(result.link).toBe(
      "https://thenational.academy/pupils/lessons/lesson-slug?share=true",
    );
    expect(result.urlEncodedLink).toBe(
      "https%3A%2F%2Fthenational.academy%2Fpupils%2Flessons%2Flesson-slug%3Fshare%3Dtrue",
    );
  });
  it("uses the correct url for the new pupils experience", () => {
    const result = getSharingMetadata({
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.copy,
    });
    expect(result.link).toBe(
      "https://thenational.academy/pupils/lessons/lesson-slug?share=true",
    );
  });
});
