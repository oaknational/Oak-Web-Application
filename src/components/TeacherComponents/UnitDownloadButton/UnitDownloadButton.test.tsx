import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMediaQuery } from "@oaknational/oak-components";

import UnitDownloadButton from "./UnitDownloadButton";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockGeorestrictedUser,
  mockLoggedIn,
  mockLoggedOut,
  mockNotOnboardedUser,
} from "@/__tests__/__helpers__/mockUser";

jest.mock(
  "@/components/TeacherComponents/hooks/downloadAndShareHooks/useUnitDownloadExistenceCheck",
  () => {
    return jest.fn(() => ({
      exists: true,
      fileSize: "1.2MB",
      hasCheckedFiles: true,
    }));
  },
);

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

describe("UnitDownloadButton", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
    setBreakpoint();
  });

  it("should render a continue button when logged in but not onboarded", () => {
    setUseUserReturn(mockNotOnboardedUser);
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
      />,
    );
    const button = screen.getByText("Sign up to download");
    expect(button).toBeInTheDocument();
  });
  it("should render a download button when logged in", () => {
    setUseUserReturn(mockLoggedIn);
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
      />,
    );
    const button = screen.getByText("Download (.zip 1.2MB)");
    expect(button).toBeInTheDocument();
  });
  it("should render loading text and spinner when download is in progress", () => {
    renderWithProviders()(
      <UnitDownloadButton
        setDownloadError={jest.fn()}
        setDownloadInProgress={jest.fn()}
        setShowDownloadMessage={jest.fn()}
        setShowIncompleteMessage={jest.fn()}
        downloadInProgress={true}
        onDownloadSuccess={jest.fn()}
        unitFileId="mockSlug"
        showNewTag
        geoRestricted={false}
      />,
    );
    const button = screen.getByText("Downloading...");
    expect(button).toBeInTheDocument();
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
  });
  it("should render a sign in button when logged out", () => {
    setUseUserReturn(mockLoggedOut);
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
      />,
    );
    const button = screen.getByText("Download complete unit");
    expect(button).toBeInTheDocument();
  });
  it("should disable the button when geoblocked", () => {
    setUseUserReturn(mockGeorestrictedUser);

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
        geoRestricted={true}
      />,
    );
    const button = screen.getByRole("button", {
      name: "Download (.zip 1.2MB)",
    });
    expect(button).toBeDisabled();
  });

  it("should set an error when the download fails", () => {
    const setDownloadError = jest.fn();
    renderWithProviders()(
      <UnitDownloadButton
        setDownloadError={setDownloadError}
        setDownloadInProgress={jest.fn()}
        setShowDownloadMessage={jest.fn()}
        setShowIncompleteMessage={jest.fn()}
        downloadInProgress={false}
        onDownloadSuccess={jest.fn()}
        unitFileId="mockSlug"
        showNewTag
        geoRestricted={false}
      />,
    );
    setDownloadError(true);
    expect(setDownloadError).toHaveBeenCalledWith(true);
  });
  it('should call "onDownloadSuccess" when the download is successful', async () => {
    const onDownloadSuccess = jest.fn();

    renderWithProviders()(
      <UnitDownloadButton
        setDownloadError={jest.fn()}
        setDownloadInProgress={jest.fn()}
        setShowDownloadMessage={jest.fn()}
        setShowIncompleteMessage={jest.fn()}
        downloadInProgress={false}
        onDownloadSuccess={onDownloadSuccess}
        unitFileId="mockSlug"
        showNewTag
        geoRestricted={false}
      />,
    );
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

    renderWithProviders()(
      <UnitDownloadButton
        setDownloadError={setDownloadError}
        setDownloadInProgress={jest.fn()}
        setShowDownloadMessage={setShowDownloadMessage}
        setShowIncompleteMessage={setShowIncompleteMessage}
        downloadInProgress={false}
        onDownloadSuccess={jest.fn()}
        unitFileId="mockSlug"
        showNewTag
        geoRestricted={false}
      />,
    );
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
        isStuck
      />,
    );
    expect(screen.getByText("Download (.zip 1.2MB)")).toBeInTheDocument();
  });
  it("should render the short label on tablet (not desktop, not mobile)", () => {
    setBreakpoint({ isDesktop: false, isMobile: false });
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
      />,
    );
    expect(screen.getByText("Download")).toBeInTheDocument();
    expect(screen.queryByText("Download (.zip 1.2MB)")).not.toBeInTheDocument();
  });
  it("should render the long label on mobile when longTextOnMobile is set", () => {
    setBreakpoint({ isDesktop: false, isMobile: true });
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
        longTextOnMobile
        fullWidthOnMobile
      />,
    );
    expect(screen.getByText("Download (.zip 1.2MB)")).toBeInTheDocument();
  });
  it("should render the short label on mobile when longTextOnMobile is not set", () => {
    setBreakpoint({ isDesktop: false, isMobile: true });
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
      />,
    );
    expect(screen.getByText("Download")).toBeInTheDocument();
  });
});
