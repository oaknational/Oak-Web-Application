import ComplexCopyrightRestrictionBanner from "./ComplexCopyrightRestrictionBanner";

import renderWithProviders, {
  allProviders,
} from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedIn,
  mockNotOnboardedUser,
  mockGeorestrictedUser,
  mockUserWithDownloadAccess,
  mockUserWithoutDownloadAccessNotOnboarded,
} from "@/__tests__/__helpers__/mockUser";
import { getProgrammeStateForUnit } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";
import teachersUnitOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersUnitOverview.fixture";

const mockTrackContentBlock = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      contentBlockNotificationDisplayed: (...args: unknown[]) =>
        mockTrackContentBlock(...args),
    },
  }),
}));
const mockFeatureFlagEnabled = jest.fn();
jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => mockFeatureFlagEnabled(),
}));

const render = renderWithProviders();
const renderOnUnitPage = renderWithProviders({
  ...allProviders,
  teacherBrowseAnalytics: {
    programmeState: getProgrammeStateForUnit(teachersUnitOverviewFixture()),
    accessLevel: "unit",
  },
});

describe("CopyrightRestrictionBanner", () => {
  beforeEach(() => {
    mockFeatureFlagEnabled.mockReturnValueOnce(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when signed out", () => {
    it("renders with unit text and signin link on a georestricted and login required unit page", () => {
      const { getByTestId } = render(
        <ComplexCopyrightRestrictionBanner
          isGeorestricted={true}
          isLoginRequired={true}
          componentType="lesson_listing"
        />,
      );

      const bannerText = getByTestId("copyright-banner-signed-out").textContent;
      const link = getByTestId("copyright-banner-signin-link");

      expect(bannerText).toEqual(
        "Copyrighted materials: to view and download resources from this unit, you’ll need to be in the UK and sign in.Copyrights help",
      );
      expect(link).toBeInTheDocument();
    });

    it("renders with non-UK unit text on a non-georestricted and login required unit page", () => {
      const { getByTestId } = render(
        <ComplexCopyrightRestrictionBanner
          isGeorestricted={false}
          isLoginRequired={true}
          componentType="lesson_listing"
        />,
      );

      const bannerText = getByTestId("copyright-banner-signed-out").textContent;

      expect(bannerText).toEqual(
        "Copyrighted materials: to view and download resources from this unit, you’ll need to sign in.Copyrights help",
      );
    });

    it("renders with lesson text on a georestricted and login required lesson page", () => {
      const { getByTestId } = render(
        <ComplexCopyrightRestrictionBanner
          isGeorestricted={true}
          isLoginRequired={true}
          componentType="lesson_overview"
        />,
      );

      const bannerText = getByTestId("copyright-banner-signed-out").textContent;

      expect(bannerText).toEqual(
        "Copyrighted materials: to view and download resources from this lesson, you’ll need to be in the UK and sign in.Copyrights help",
      );
    });
  });

  describe("when signed in but not onboarded", () => {
    it("renders with onboarding link on a georestricted and login required lesson page", () => {
      setUseUserReturn(mockNotOnboardedUser);
      const { getByTestId } = render(
        <ComplexCopyrightRestrictionBanner
          isGeorestricted={true}
          isLoginRequired={true}
          componentType="lesson_listing"
        />,
      );

      const bannerText = getByTestId("copyright-banner-signed-out").textContent;
      const link = getByTestId("copyright-banner-onboarding-link");

      expect(bannerText).toEqual(
        "Copyrighted materials: to view and download resources from this unit, you’ll need to be in the UK and complete sign up.Copyrights help",
      );
      expect(link).toBeInTheDocument();
    });

    it("only renders the geoblocked banner when georestricted and not onboarded", () => {
      setUseUserReturn({
        ...mockLoggedIn,
        user: mockUserWithoutDownloadAccessNotOnboarded,
      });
      const { getByTestId, queryByTestId } = render(
        <ComplexCopyrightRestrictionBanner
          isGeorestricted={true}
          isLoginRequired={true}
          componentType="lesson_listing"
        />,
      );
      const geoBlockedBanner = getByTestId("copyright-banner-signed-in");
      const signedOutBanner = queryByTestId("copyright-banner-signed-out");
      expect(geoBlockedBanner).toBeInTheDocument();
      expect(signedOutBanner).not.toBeInTheDocument();
    });
  });

  describe("when signed in", () => {
    it("does not render on a georestricted page if user is not geoblocked", () => {
      setUseUserReturn({
        ...mockLoggedIn,
        user: mockUserWithDownloadAccess,
      });

      const { queryByTestId } = render(
        <ComplexCopyrightRestrictionBanner
          isGeorestricted={true}
          isLoginRequired={true}
          componentType="lesson_listing"
        />,
      );

      const banner = queryByTestId("copyright-banner-signed-in");

      expect(banner).not.toBeInTheDocument();
    });

    it("renders on a georestricted page if user is geoblocked", () => {
      setUseUserReturn(mockGeorestrictedUser);

      const { getByTestId, queryByTestId } = render(
        <ComplexCopyrightRestrictionBanner
          isGeorestricted={true}
          isLoginRequired={true}
          componentType="lesson_listing"
        />,
      );

      const signedInBannerText = getByTestId(
        "copyright-banner-signed-in",
      ).textContent;
      const signedOutBanner = queryByTestId("copyright-banner-signed-out");

      expect(signedInBannerText).toEqual(
        "Sorry but this unit can only be downloaded if you are located in the UK.Some of our content is restricted to the UK due to copyright. You can read more about copyrights or if you believe this is an error and you’re based in the UK, please contact us.",
      );
      expect(signedOutBanner).not.toBeInTheDocument();
    });

    it("tracks content block event on a georestricted unit page when user is geoblocked", async () => {
      setUseUserReturn(mockGeorestrictedUser);

      renderOnUnitPage(
        <ComplexCopyrightRestrictionBanner
          isGeorestricted={true}
          isLoginRequired={true}
          componentType="lesson_listing"
        />,
      );

      expect(mockTrackContentBlock).toHaveBeenCalledWith({
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "explore",
        componentType: "lesson_listing",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
        lessonName: null,
        lessonSlug: null,
        lessonReleaseCohort: null,
        lessonReleaseDate: null,
        unitName: "Cells",
        unitSlug: "cells",
        contentType: "unit",
        accessBlockType: "Geo-restriction",
        accessBlockDetails: {},
      });
    });

    it("tracks content block event on a georestricted lesson page when user is geoblocked", async () => {
      setUseUserReturn(mockGeorestrictedUser);

      render(
        <ComplexCopyrightRestrictionBanner
          isGeorestricted={true}
          isLoginRequired={true}
          componentType="lesson_overview"
        />,
      );

      expect(mockTrackContentBlock).toHaveBeenCalledWith({
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "explore",
        componentType: "lesson_overview",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
        lessonName: "Structure of cells",
        lessonSlug: "lesson-3-structure-of-cells",
        lessonReleaseCohort: "2023-2026",
        lessonReleaseDate: "2024-09-29T14:00:00.000Z",
        unitName: "Cells",
        unitSlug: "cells",
        contentType: "lesson",
        accessBlockType: "Geo-restriction",
        accessBlockDetails: {},
      });
    });
  });
});
