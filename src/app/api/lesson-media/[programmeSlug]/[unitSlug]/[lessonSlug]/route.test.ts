/**
 * @jest-environment node
 */
import { GET } from "./route";

import {
  mockServerUser,
  setCurrentUser,
  User,
} from "@/__tests__/__helpers__/mockClerkServer";
import { LessonMediaClipsData } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

jest.mock("@clerk/nextjs/server");

const mockLessonMediaClips = jest.fn();
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    lessonMediaClips: (...args: unknown[]) => mockLessonMediaClips(...args),
  },
}));

jest.mock("@/utils/handleTranscript", () => ({
  populateMediaClipsWithTranscripts: async (
    clips: LessonMediaClipsData["mediaClips"],
  ) => clips,
}));

const fixture = lessonMediaClipsFixtures({ subjectSlug: "maths" });
const restrictedFixture = { ...fixture, loginRequired: true };
const geoRestrictedFixture = { ...fixture, geoRestricted: true };

const userWithMetadata = (publicMetadata: UserPublicMetadata) =>
  ({ ...mockServerUser, publicMetadata }) as User;

const onboardedUser = userWithMetadata({
  owa: { isOnboarded: true, isRegionAuthorised: true },
});

const callRoute = () =>
  GET(new Request("http://example.com"), {
    params: Promise.resolve({
      programmeSlug: "p",
      unitSlug: "u",
      lessonSlug: "l",
    }),
  });

describe("/api/lesson-media/[programmeSlug]/[unitSlug]/[lessonSlug]", () => {
  beforeEach(() => {
    mockLessonMediaClips.mockResolvedValue(fixture);
    setCurrentUser(null);
  });

  it("returns media clips for unrestricted lessons without auth", async () => {
    const res = await callRoute();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ mediaClips: fixture.mediaClips });
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
  });

  it("returns 404 when the lesson cannot be fetched", async () => {
    mockLessonMediaClips.mockRejectedValue(new Error("Not found"));

    expect((await callRoute()).status).toBe(404);
  });

  it("returns 401 for signed out users on restricted lessons", async () => {
    mockLessonMediaClips.mockResolvedValue(restrictedFixture);

    expect((await callRoute()).status).toBe(401);
  });

  it("returns 403 for users who are not onboarded", async () => {
    mockLessonMediaClips.mockResolvedValue(restrictedFixture);
    setCurrentUser(userWithMetadata({}));

    expect((await callRoute()).status).toBe(403);
  });

  it("returns 403 for users outside an authorised region on georestricted lessons", async () => {
    mockLessonMediaClips.mockResolvedValue(geoRestrictedFixture);
    setCurrentUser(
      userWithMetadata({
        owa: { isOnboarded: true, isRegionAuthorised: false },
      }),
    );

    expect((await callRoute()).status).toBe(403);
  });

  it("returns media clips for onboarded users in an authorised region", async () => {
    mockLessonMediaClips.mockResolvedValue(geoRestrictedFixture);
    setCurrentUser(onboardedUser);

    const res = await callRoute();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ mediaClips: fixture.mediaClips });
  });
});
