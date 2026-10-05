import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMediaQuery } from "@oaknational/oak-components";

import UnitDownloadButton, {
  UnitDownloadButtonProps,
} from "./UnitDownloadButton";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockGeorestrictedUser,
  mockLoggedIn,
  mockLoggedOut,
  mockNotOnboardedUser,
} from "@/__tests__/__helpers__/mockUser";

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink",
  () => jest.fn(),
);

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink",
  () => ({
    createUnitDownloadLink: jest.fn(() => Promise.resolve("mockDownloadUrl")),
  }),
);

jest.mock("@oaknational/oak-components", () => ({
  ...jest.requireActual("@oaknational/oak-components"),
  useMediaQuery: jest.fn(),
}));

const mockUnitDownloadStarted = jest.fn();
const mockUnitDownloaded = jest.fn();

jest.mock(
  "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider",
  () => ({
    ...jest.requireActual(
      "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider",
    ),
    useTeacherBrowseAnalytics: () => ({
      unitDownloadStarted: mockUnitDownloadStarted,
      unitDownloaded: mockUnitDownloaded,
    }),
  }),
);

const mockedUseMediaQuery = jest.mocked(useMediaQuery);

// Default: behave like a desktop viewport (matches the previous matchMedia mock)
const setBreakpoint = ({
  isDesktop = true,
  isMobile = false,
}: {
  isDesktop?: boolean;
  isMobile?: boolean;
} = {}) => {
  mockedUseMediaQuery.mockImplementation((query) => {
    if (query === "desktop") {
      return isDesktop;
    }
    if (query === "mobile") {
      return isMobile;
    }
    return false;
  });
};

const renderUnitDownloadButton = (
  props: Partial<UnitDownloadButtonProps> = {},
) =>
  renderWithProviders()(
    <UnitDownloadButton
      setDownloadError={jest.fn()}
      setDownloadInProgress={jest.fn()}
      setShowDownloadMessage={jest.fn()}
      setShowIncompleteMessage={jest.fn()}
      downloadInProgress={false}
      onDownloadSuccess={jest.fn()}
      unitFileId="mockSlug"
      showNewTag
      geoRestricted={false}
      downloadExists
      fileSize="1.2MB"
      {...props}
    />,
  );

describe("UnitDownloadButton", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
    setBreakpoint();
    mockUnitDownloadStarted.mockClear();
    mockUnitDownloaded.mockClear();
  });

  it("should render a continue button when logged in but not onboarded", () => {
    setUseUserReturn(mockNotOnboardedUser);
    renderUnitDownloadButton();
    const button = screen.getByText("Sign up to download");
    expect(button).toBeInTheDocument();
  });
  it("should render a download button when logged in", () => {
    setUseUserReturn(mockLoggedIn);
    renderUnitDownloadButton();
    const button = screen.getByText("Download (.zip 1.2MB)");
    expect(button).toBeInTheDocument();
  });
  it("should render loading text and spinner when download is in progress", () => {
    renderUnitDownloadButton({ downloadInProgress: true });
    const button = screen.getByText("Downloading...");
    expect(button).toBeInTheDocument();
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
  });
  it("should render a sign in button when logged out", () => {
    setUseUserReturn(mockLoggedOut);
    renderUnitDownloadButton();
    const button = screen.getByText("Download complete unit");
    expect(button).toBeInTheDocument();
  });
  it("should disable the button when geoblocked", () => {
    setUseUserReturn(mockGeorestrictedUser);

    renderUnitDownloadButton({ geoRestricted: true });
    const button = screen.getByRole("button", {
      name: "Download (.zip 1.2MB)",
    });
    expect(button).toBeDisabled();
  });

  it("should set an error when the download fails", () => {
    const setDownloadError = jest.fn();
    renderUnitDownloadButton({ setDownloadError });
    setDownloadError(true);
    expect(setDownloadError).toHaveBeenCalledWith(true);
  });
  it('should call "onDownloadSuccess" when the download is successful', async () => {
    const onDownloadSuccess = jest.fn();

    renderUnitDownloadButton({ onDownloadSuccess });
    const button = screen.getByRole("button", {
      name: "Download (.zip 1.2MB)",
    });
    const user = userEvent.setup();
    await user.click(button);
    expect(onDownloadSuccess).toHaveBeenCalledTimes(1);
  });
  it("should set a download error when the download link request fails", async () => {
    const { createUnitDownloadLink } = jest.requireMock(
      "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink",
    );
    createUnitDownloadLink.mockRejectedValueOnce(new Error("network error"));
    const setDownloadError = jest.fn();
    const setShowDownloadMessage = jest.fn();
    const setShowIncompleteMessage = jest.fn();

    renderUnitDownloadButton({
      setDownloadError,
      setShowDownloadMessage,
      setShowIncompleteMessage,
    });
    const button = screen.getByRole("button", {
      name: "Download (.zip 1.2MB)",
    });
    const user = userEvent.setup();
    await user.click(button);

    expect(setDownloadError).toHaveBeenCalledWith(true);
    expect(setShowDownloadMessage).toHaveBeenCalledWith(false);
    expect(setShowIncompleteMessage).toHaveBeenCalledWith(false);
  });
  it("should render the long label when stuck, regardless of breakpoint", () => {
    setBreakpoint({ isDesktop: false, isMobile: false });
    renderUnitDownloadButton({ isStuck: true });
    expect(screen.getByText("Download (.zip 1.2MB)")).toBeInTheDocument();
  });
  it("should render the short label on tablet (not desktop, not mobile)", () => {
    setBreakpoint({ isDesktop: false, isMobile: false });
    renderUnitDownloadButton();
    expect(screen.getByText("Download")).toBeInTheDocument();
    expect(screen.queryByText("Download (.zip 1.2MB)")).not.toBeInTheDocument();
  });
  it("should render the long label on mobile when longTextOnMobile is set", () => {
    setBreakpoint({ isDesktop: false, isMobile: true });
    renderUnitDownloadButton({
      longTextOnMobile: true,
      fullWidthOnMobile: true,
    });
    expect(screen.getByText("Download (.zip 1.2MB)")).toBeInTheDocument();
  });
  it("should render the short label on mobile when longTextOnMobile is not set", () => {
    setBreakpoint({ isDesktop: false, isMobile: true });
    renderUnitDownloadButton();
    expect(screen.getByText("Download")).toBeInTheDocument();
  });

  describe("analytics events", () => {
    it("tracks the event when a logged out user starts the sign in flow", async () => {
      setUseUserReturn(mockLoggedOut);
      renderUnitDownloadButton();

      await userEvent.setup().click(screen.getByText("Download complete unit"));

      expect(mockUnitDownloadStarted).toHaveBeenCalledTimes(1);
    });

    it("tracks the event when a user who has not onboarded starts the onboarding flow", async () => {
      setUseUserReturn(mockNotOnboardedUser);
      renderUnitDownloadButton();

      const link = screen.getByText("Sign up to download").closest("a")!;
      link.addEventListener("click", (e) => e.preventDefault());

      await userEvent.setup().click(link);

      expect(mockUnitDownloadStarted).toHaveBeenCalledTimes(1);
    });

    it("does not track the event when an onboarded user downloads directly", async () => {
      setUseUserReturn(mockLoggedIn);
      renderUnitDownloadButton();

      await userEvent
        .setup()
        .click(screen.getByRole("button", { name: "Download (.zip 1.2MB)" }));

      expect(mockUnitDownloadStarted).not.toHaveBeenCalled();
    });

    it("tracks the unit downloaded event when the download succeeds", async () => {
      setUseUserReturn(mockLoggedIn);
      renderUnitDownloadButton({
        onDownloadSuccess: () => mockUnitDownloaded(),
      });

      await userEvent
        .setup()
        .click(screen.getByRole("button", { name: "Download (.zip 1.2MB)" }));

      expect(mockUnitDownloaded).toHaveBeenCalledTimes(1);
    });

    it("does not track the unit downloaded event when the download fails", async () => {
      const { createUnitDownloadLink } = jest.requireMock(
        "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink",
      );
      createUnitDownloadLink.mockRejectedValueOnce(new Error("network error"));
      setUseUserReturn(mockLoggedIn);
      renderUnitDownloadButton({
        onDownloadSuccess: () => mockUnitDownloaded(),
      });

      await userEvent
        .setup()
        .click(screen.getByRole("button", { name: "Download (.zip 1.2MB)" }));

      expect(mockUnitDownloaded).not.toHaveBeenCalled();
    });
  });
});
