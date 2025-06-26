import CopyrightRestrictionBanner from "./CopyrightRestrictionBanner";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedIn,
  mockNotOnboardedUser,
  mockGeorestrictedUser,
  mockUserWithDownloadAccess,
} from "@/__tests__/__helpers__/mockUser";

const mockFeatureFlag = jest.fn();
jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => mockFeatureFlag,
}));

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

const render = renderWithProviders();

describe("CopyrightRestrictionBanner", () => {
  beforeEach(() => {
    mockFeatureFlag.mockReturnValue(true);
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
          isUnit
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
          isUnit
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
        />,
      );

      const bannerText = getByTestId("copyright-banner-signed-out").textContent;

      expect(bannerText).toEqual(
        "Copyrighted materials: to view and download resources from this lesson, you’ll need to be in the UK and sign in.Copyrights help",
      );
    });
  });

  describe("when signed in but not onboarded", () => {
    beforeEach(() => {
      setUseUserReturn(mockNotOnboardedUser);
    });

    it("renders with onboarding link on a georestricted and login required lesson page", () => {
      const { getByTestId } = render(
        <CopyrightRestrictionBanner
          isGeorestricted={true}
          isLoginRequired={true}
          isUnit
        />,
      );

      const bannerText = getByTestId("copyright-banner-signed-out").textContent;
      const link = getByTestId("copyright-banner-onboarding-link");

      expect(bannerText).toEqual(
        "Copyrighted materials: to view and download resources from this unit, you’ll need to be in the UK and sign in.Copyrights help",
      );
      expect(link).toBeInTheDocument();
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
          isUnit
        />,
      );

      const banner = queryByTestId("copyright-banner-signed-in");

      expect(banner).not.toBeInTheDocument();
    });

    it("renders on a georestricted page if user is geoblocked", () => {
      setUseUserReturn(mockGeorestrictedUser);

      const { getByTestId } = render(
        <CopyrightRestrictionBanner
          isGeorestricted={true}
          isLoginRequired={true}
          isUnit
        />,
      );

      const bannerText = getByTestId("copyright-banner-signed-in").textContent;

      expect(bannerText).toEqual(
        "Sorry but this unit can only be downloaded if you are located in the UK.Some of our content is restricted to the UK due to copyright. You can read more about copyrights or if you believe this is an error and you’re based in the UK, please contact us.",
      );
    });
  });
});
