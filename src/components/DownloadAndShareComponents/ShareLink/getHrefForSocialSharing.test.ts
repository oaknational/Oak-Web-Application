import { getHrefForSocialSharing } from "./getHrefForSocialSharing";
import { shareLinkConfig } from "./linkConfig";

describe("getHrefForSocialSharing", () => {
  it("returns sharing link for copy", () => {
    const href = getHrefForSocialSharing({
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.copy,
    });

    expect(href).toBe(
      "https://classroom.thenational.academy/lessons/lesson-slug?utm_campaign=sharing-button&utm_medium=copy-link",
    );
  });
  it("returns url encoded href for google classroom", () => {
    const href = getHrefForSocialSharing({
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.googleClassroom,
    });
    expect(href).toBe(
      "https://classroom.google.com/u/0/share?url=https%3A%2F%2Fclassroom.thenational.academy%2Flessons%2Flesson-slug%3Futm_campaign%3Dsharing-button%26utm_source%3Dgoogle-classroom%26utm_medium%3Dsocial",
    );
  });
  it("returns url encoded href for microsoft teams", () => {
    const href = getHrefForSocialSharing({
      lessonSlug: "lesson-slug",
      linkConfig: shareLinkConfig.microsoftTeams,
    });
    expect(href).toBe(
      "https://teams.microsoft.com/share?href=https%3A%2F%2Fclassroom.thenational.academy%2Flessons%2Flesson-slug%3Futm_campaign%3Dsharing-button%26utm_source%3Dmicrosoft-teams%26utm_medium%3Dsocial&text=",
    );
  });
});
