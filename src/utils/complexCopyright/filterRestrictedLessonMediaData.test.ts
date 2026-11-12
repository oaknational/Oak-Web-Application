import { filterRestrictedLessonMediaData } from "./filterRestrictedLessonMediaData";

import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

const lessonData = lessonMediaClipsFixtures();
const signedOutAuthState = {
  isSignedIn: false,
  isOnboarded: false,
  isRegionAuthorised: false,
};
const signedInNotOnboardedAuthState = {
  isSignedIn: true,
  isOnboarded: false,
  isRegionAuthorised: true,
};
const signedInGeorestrictedAuthState = {
  isSignedIn: true,
  isOnboarded: true,
  isRegionAuthorised: false,
};
const signedInGeoAuthenticatedAuthState = {
  isSignedIn: true,
  isOnboarded: true,
  isRegionAuthorised: true,
};

describe("filterRestrictedLessonMediaData", () => {
  it("returns all data when there are no restrictions", () => {
    const result = filterRestrictedLessonMediaData(
      lessonData,
      signedOutAuthState,
    );
    expect(result).toEqual(lessonData);
  });

  it.each([
    [
      "georestricted",
      "signed out",
      { geoRestricted: true },
      signedOutAuthState,
    ],
    [
      "login required",
      "signed out",
      { loginRequired: true },
      signedOutAuthState,
    ],
    [
      "login required",
      "not onboarded",
      { loginRequired: true },
      signedInNotOnboardedAuthState,
    ],
    [
      "georestricted",
      "not geo authenticated",
      { geoRestricted: true },
      signedInGeorestrictedAuthState,
    ],
  ])(
    "strips media clips when lesson is %s and user is %s",
    (_, __, restriction, authState) => {
      const result = filterRestrictedLessonMediaData(
        { ...lessonData, ...restriction },
        authState,
      );
      expect(result.mediaClips).toEqual({});
    },
  );

  it("returns media clips when lesson is georestricted and user is geo authenticated", () => {
    const geoRestrictedLesson = { ...lessonData, geoRestricted: true };
    const result = filterRestrictedLessonMediaData(
      geoRestrictedLesson,
      signedInGeoAuthenticatedAuthState,
    );
    expect(result).toEqual(geoRestrictedLesson);
  });

  it("returns media clips when lesson is login required and user is signed in and onboarded", () => {
    const loginRequiredLesson = { ...lessonData, loginRequired: true };
    const result = filterRestrictedLessonMediaData(
      loginRequiredLesson,
      signedInGeorestrictedAuthState,
    );
    expect(result).toEqual(loginRequiredLesson);
  });
});
