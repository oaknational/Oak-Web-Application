import { getSharingMetadata } from "./getSharingMetadata";
import { shareLinkConfig } from "./linkConfig";

describe("getSharingMetadata", () => {
  it("generates sharing metadata for copy", () => {
    const result = getSharingMetadata({
      selectedActivities: ["exit-quiz", "video"],
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.copy,
      shareVariant: "exit-quiz-only",
    });

    expect(result.link).toBe(
      "http://localhost:3000/pupils/lessons/lesson-slug/shared/exit-quiz-only/overview",
    );
  });
  it("generates sharing metadata for microsoft teams", () => {
    const result = getSharingMetadata({
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.microsoftTeams,
      shareVariant: "exit-quiz-only",
    });

    expect(result.link).toBe(
      "http://localhost:3000/pupils/lessons/lesson-slug/shared/exit-quiz-only/overview",
    );
    expect(result.urlEncodedLink).toBe(
      "http%3A%2F%2Flocalhost%3A3000%2Fpupils%2Flessons%2Flesson-slug%2Fshared%2Fexit-quiz-only%2Foverview",
    );
  });
  it("uses the correct url for the new pupils experience", () => {
    const result = getSharingMetadata({
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.copy,
      shareVariant: "exit-quiz-only",
    });
    expect(result.link).toBe(
      "http://localhost:3000/pupils/lessons/lesson-slug/shared/exit-quiz-only/overview",
    );
  });
});
