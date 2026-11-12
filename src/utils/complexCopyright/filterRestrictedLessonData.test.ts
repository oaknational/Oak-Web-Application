import { filterRestrictedLessonData } from "./filterRestrictedLessonData";

import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";

const lessonData = teachersLessonOverviewFixture();
const signedOutAuthState = {
  isSignedIn: false,
  isOnboarded: false,
  isRegionAuthorised: false,
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
const restrictedFields = {
  lessonMediaClips: null,
  videoMuxPlaybackId: null,
  videoWithSignLanguageMuxPlaybackId: null,
  transcriptSentences: null,
  additionalFiles: null,
  lessonOutline: null,
  worksheetUrl: null,
  presentationUrl: null,
  lessonGuideUrl: null,
  hasMediaClips: false,
};

describe("filterRestrictedLessonData", () => {
  it("returns all data when there are no restrictions", () => {
    const result = filterRestrictedLessonData(lessonData, signedOutAuthState);
    expect(result).toEqual(lessonData);
  });
  it("strips out restricted content when lesson is georestricted and user is signed out", () => {
    const result = filterRestrictedLessonData(
      { ...lessonData, geoRestricted: true },
      signedOutAuthState,
    );
    expect(result).toMatchObject(expect.objectContaining(restrictedFields));
  });
  it("strips out restricted content when lesson is loginRequired and user is signed out", () => {
    const result = filterRestrictedLessonData(
      { ...lessonData, loginRequired: true },
      signedOutAuthState,
    );
    expect(result).toMatchObject(expect.objectContaining(restrictedFields));
  });
  it("strips out restricted content when lesson is georestricted and user is not geoAuthenticated", () => {
    const result = filterRestrictedLessonData(
      { ...lessonData, geoRestricted: true },
      signedInGeorestrictedAuthState,
    );
    expect(result).toMatchObject(expect.objectContaining(restrictedFields));
  });
  it("returns restricted content when lesson is georestricted and user is geoauthenticated", () => {
    const geoRestrictedLesson = { ...lessonData, geoRestricted: true };
    const result = filterRestrictedLessonData(
      geoRestrictedLesson,
      signedInGeoAuthenticatedAuthState,
    );
    expect(result).toEqual(geoRestrictedLesson);
  });
  it("returns restricted content when lesson is login required and user is signed in", () => {
    const loginRequiredLesson = { ...lessonData, loginRequired: true };
    const result = filterRestrictedLessonData(
      loginRequiredLesson,
      signedInGeorestrictedAuthState,
    );
    expect(result).toEqual(loginRequiredLesson);
  });
});
