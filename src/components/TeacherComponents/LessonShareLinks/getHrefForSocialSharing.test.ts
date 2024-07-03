import { getHrefForSocialSharing } from "./getHrefForSocialSharing";
import { shareLinkConfig } from "./linkConfig";

describe("getHrefForSocialSharing", () => {
  it("returns sharing link for copy", () => {
    const href = getHrefForSocialSharing({
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.copy,
    });

    expect(href).toBe(
      "https://thenational.academy/pupils/lessons/lesson-slug?share=true",
    );
  });
  it("returns url encoded href for google classroom", () => {
    const href = getHrefForSocialSharing({
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.googleClassroom,
    });
    expect(href).toBe(
      "https://classroom.google.com/u/0/share?url=https%3A%2F%2Fthenational.academy%2Fpupils%2Flessons%2Flesson-slug%3Fshare%3Dtrue",
    );
  });
  it("returns url encoded href for microsoft teams", () => {
    const href = getHrefForSocialSharing({
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.microsoftTeams,
    });
    expect(href).toBe(
      "https://teams.microsoft.com/share?href=https%3A%2F%2Fthenational.academy%2Fpupils%2Flessons%2Flesson-slug%3Fshare%3Dtrue&text=",
    );
  });
});
