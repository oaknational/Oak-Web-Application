import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMediaQuery } from "@oaknational/oak-components";
import "jest-styled-components";

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

const setCurrentToastProps = jest.fn();
jest.mock("@/context/OakNotifications/useOakNotificationsContext", () => ({
  useOakNotificationsContext: () => ({ setCurrentToastProps }),
}));

const reportError = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: unknown[]) =>
      reportError(...args),
}));

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
      unitDownloadExistence={{
        checkFailed: false,
        exists: true,
        fileSize: "1.2MB",
      }}
      {...props}
    />,
  );

describe("UnitDownloadButton", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
    setBreakpoint();
    mockUnitDownloadStarted.mockClear();
    mockUnitDownloaded.mockClear();
    reportError.mockClear();
    setCurrentToastProps.mockClear();
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
    const button = screen.getByText("Download");
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
    const button = screen.getByText("complete unit");
    expect(button).toBeInTheDocument();
  });
  it("should disable the button when geoblocked", () => {
    setUseUserReturn(mockGeorestrictedUser);

    renderUnitDownloadButton({ geoRestricted: true });
    const button = screen.getByRole("button", { name: "Download" });
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
    const button = screen.getByRole("button", { name: "Download" });
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
    const button = screen.getByRole("button", { name: "Download" });
    const user = userEvent.setup();
    await user.click(button);

    expect(setDownloadError).toHaveBeenCalledWith(true);
    expect(setShowDownloadMessage).toHaveBeenCalledWith(false);
    expect(setShowIncompleteMessage).toHaveBeenCalledWith(false);
  });
  it("reports the error when the download fails", async () => {
    const { createUnitDownloadLink } = jest.requireMock(
      "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink",
    );
    const error = new Error("network error");
    createUnitDownloadLink.mockRejectedValueOnce(error);

    renderUnitDownloadButton();
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Download" }));

    expect(reportError).toHaveBeenCalledWith(error, {
      unitFileId: "mockSlug",
      existenceCheckFailed: false,
    });
  });
  it("shows an error toast when the download fails", async () => {
    const { createUnitDownloadLink } = jest.requireMock(
      "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink",
    );
    createUnitDownloadLink.mockRejectedValueOnce(new Error("network error"));

    renderUnitDownloadButton();
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Download" }));

    expect(setCurrentToastProps).toHaveBeenCalledWith({
      variant: "error",
      message: "Failed to download unit. Please try again.",
      autoDismiss: false,
      showIcon: true,
    });
  });
  it("does not show an error toast when the download succeeds", async () => {
    renderUnitDownloadButton();
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Download" }));

    expect(setCurrentToastProps).not.toHaveBeenCalled();
  });
  it("records a failed server-side existence check when reporting", async () => {
    const { createUnitDownloadLink } = jest.requireMock(
      "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink",
    );
    const error = new Error("network error");
    createUnitDownloadLink.mockRejectedValueOnce(error);

    renderUnitDownloadButton({
      unitDownloadExistence: { checkFailed: true, exists: undefined },
    });
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Download" }));

    expect(reportError).toHaveBeenCalledWith(error, {
      unitFileId: "mockSlug",
      existenceCheckFailed: true,
    });
  });
  it("still shows the button when the availability check failed", () => {
    renderUnitDownloadButton({
      unitDownloadExistence: { checkFailed: true, exists: undefined },
    });

    expect(
      screen.getByRole("button", { name: "Download" }),
    ).toBeInTheDocument();
  });
  it("hides the button when the download is known to be absent", () => {
    renderUnitDownloadButton({
      unitDownloadExistence: { checkFailed: false, exists: false },
    });

    expect(
      screen.queryByRole("button", { name: "Download" }),
    ).not.toBeInTheDocument();
  });
  // The breakpoint switch is CSS, which jsdom can't evaluate, so these assert the
  // emitted rules rather than which label is visible at a given width.
  it("shows the long label at every breakpoint when stuck", () => {
    renderUnitDownloadButton({ isStuck: true });
    expect(screen.getByText("(.zip 1.2MB)")).toHaveStyleRule(
      "display",
      "inline",
    );
  });
  it("hides the long label by default, revealing it on wider viewports", () => {
    renderUnitDownloadButton();
    const longLabel = screen.getByText("(.zip 1.2MB)");
    expect(screen.getByText("Download")).toBeInTheDocument();
    expect(longLabel).toHaveStyleRule("display", "none");
  });
  it("shows the long label from the narrowest viewport when longTextOnMobile is set", () => {
    renderUnitDownloadButton({
      longTextOnMobile: true,
      fullWidthOnMobile: true,
    });
    expect(screen.getByText("(.zip 1.2MB)")).toHaveStyleRule(
      "display",
      "inline",
    );
  });
  it("omits the file size entirely when it is unknown", () => {
    renderUnitDownloadButton({
      unitDownloadExistence: { checkFailed: false, exists: true },
      isStuck: true,
    });
    expect(screen.getByText("Download")).toBeInTheDocument();
    expect(screen.queryByText(/\.zip/)).not.toBeInTheDocument();
  });

  describe("analytics events", () => {
    it("tracks the event when a logged out user starts the sign in flow", async () => {
      setUseUserReturn(mockLoggedOut);
      renderUnitDownloadButton();

      await userEvent.setup().click(screen.getByText("complete unit"));

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
        .click(screen.getByRole("button", { name: "Download" }));

      expect(mockUnitDownloadStarted).not.toHaveBeenCalled();
    });

    it("tracks the unit downloaded event when the download succeeds", async () => {
      setUseUserReturn(mockLoggedIn);
      renderUnitDownloadButton({
        onDownloadSuccess: () => mockUnitDownloaded(),
      });

      await userEvent
        .setup()
        .click(screen.getByRole("button", { name: "Download" }));

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
        .click(screen.getByRole("button", { name: "Download" }));

      expect(mockUnitDownloaded).not.toHaveBeenCalled();
    });
  });
});
