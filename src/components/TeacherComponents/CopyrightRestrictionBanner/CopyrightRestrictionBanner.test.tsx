import CopyrightRestrictionBanner from "./CopyrightRestrictionBanner";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedIn,
  mockNotOnboardedUser,
  mockGeorestrictedUser,
  mockUserWithDownloadAccess,
  mockUserWithoutDownloadAccessNotOnboarded,
} from "@/__tests__/__helpers__/mockUser";

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

const unitProps = {
  unitName: "Test unit title",
  unitSlug: "test-unit-title",
};
const lessonProps = {
  lessonName: "Test lesson title",
  lessonSlug: "test-lesson-title",
  lessonReleaseDate: "2025-01-01",
};

const render = renderWithProviders();

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
        <CopyrightRestrictionBanner
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
        <CopyrightRestrictionBanner
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
        <CopyrightRestrictionBanner
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
        <CopyrightRestrictionBanner
          isGeorestricted={true}
          isLoginRequired={true}
          componentType="lesson_listing"
        />,
      );

      const bannerText = getByTestId("copyright-banner-signed-out").textContent;
      const link = getByTestId("copyright-banner-onboarding-link");

      expect(bannerText).toEqual(
        "Copyrighted materials: to view and download resources from this unit, you’ll need to be in the UK and sign in.Copyrights help",
      );
      expect(link).toBeInTheDocument();
    });

    it("only renders the geoblocked banner when georestricted and not onboarded", () => {
      setUseUserReturn({
        ...mockLoggedIn,
        user: mockUserWithoutDownloadAccessNotOnboarded,
      });
      const { getByTestId, queryByTestId } = render(
        <CopyrightRestrictionBanner
          isGeorestricted={true}
          isLoginRequired={true}
          componentType="lesson_listing"
        />,
      );
      const signedInBanner = queryByTestId("copyright-banner-signed-in");
      const geoBlockedBanner = getByTestId("copyright-banner-signed-out");
      expect(geoBlockedBanner).toBeInTheDocument();
      expect(signedInBanner).not.toBeInTheDocument();
    });
  });

  describe("when signed in", () => {
    it("does not render on a georestricted page if user is not geoblocked", () => {
      setUseUserReturn({
        ...mockLoggedIn,
        user: mockUserWithDownloadAccess,
      });

      const { queryByTestId } = render(
        <CopyrightRestrictionBanner
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
        <CopyrightRestrictionBanner
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

      render(
        <CopyrightRestrictionBanner
          isGeorestricted={true}
          isLoginRequired={true}
          componentType="lesson_listing"
          {...unitProps}
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
        lessonReleaseCohort: "2023-2026",
        lessonReleaseDate: null,
        unitName: "Test unit title",
        unitSlug: "test-unit-title",
        contentType: "unit",
        accessBlockType: "Geo-restriction",
        accessBlockDetails: {},
      });
    });

    it("tracks content block event on a georestricted lesson page when user is geoblocked", async () => {
      setUseUserReturn(mockGeorestrictedUser);

      render(
        <CopyrightRestrictionBanner
          isGeorestricted={true}
          isLoginRequired={true}
          componentType="lesson_overview"
          {...unitProps}
          {...lessonProps}
        />,
      );

      expect(mockTrackContentBlock).toHaveBeenCalledWith({
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "explore",
        componentType: "lesson_overview",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
        lessonName: "Test lesson title",
        lessonSlug: "test-lesson-title",
        lessonReleaseCohort: "2023-2026",
        lessonReleaseDate: "2025-01-01",
        unitName: "Test unit title",
        unitSlug: "test-unit-title",
        contentType: "lesson",
        accessBlockType: "Geo-restriction",
        accessBlockDetails: {},
      });
    });
  });
});
