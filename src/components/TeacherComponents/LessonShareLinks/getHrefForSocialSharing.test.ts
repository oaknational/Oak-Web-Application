import { getHrefForSocialSharing } from "./getHrefForSocialSharing";
import { shareLinkConfig } from "./linkConfig";

describe("getHrefForSocialSharing", () => {
  it("returns sharing link for copy", () => {
    const href = getHrefForSocialSharing({
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.copy,
      shareVariant: "exit-quiz-only",
    });

    expect(href).toBe(
      "http://localhost:3000/pupils/lessons/lesson-slug/shared/exit-quiz-only/overview",
    );
  });
  it("returns url encoded href for google classroom", () => {
    const href = getHrefForSocialSharing({
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.googleClassroom,
      shareVariant: "exit-quiz-only",
    });
    expect(href).toBe(
      "https://classroom.google.com/u/0/share?url=http%3A%2F%2Flocalhost%3A3000%2Fpupils%2Flessons%2Flesson-slug%2Fshared%2Fexit-quiz-only%2Foverview",
    );
  });
  it("returns url encoded href for microsoft teams", () => {
    const href = getHrefForSocialSharing({
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.microsoftTeams,
      shareVariant: "exit-quiz-only",
    });
    expect(href).toBe(
      "https://teams.microsoft.com/share?href=http%3A%2F%2Flocalhost%3A3000%2Fpupils%2Flessons%2Flesson-slug%2Fshared%2Fexit-quiz-only%2Foverview&text=",
    );
  });
});
