import { screen } from "@testing-library/react";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import UnitDownloadButton from "./UnitDownloadButton";

import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn, mockLoggedOut } from "@/__tests__/__helpers__/mockUser";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

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

jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  SignUpButton: jest.fn(() => <button>Download unit</button>),
}));

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: jest.fn(),
}));

describe("UnitDownloadButton", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
    (useFeatureFlagVariantKey as jest.Mock).mockReturnValue("option-a");
  });
  it("should not render when feature flag is off or control group", () => {
    (useFeatureFlagVariantKey as jest.Mock).mockReturnValue("control");
    renderWithProviders()(
      <UnitDownloadButton
        setDownloadError={jest.fn()}
        setDownloadInProgress={jest.fn()}
        setShowDownloadMessage={jest.fn()}
        downloadInProgress={false}
        onDownloadSuccess={jest.fn()}
        unitProgrammeSlug="mockSlug"
      />,
    );
    const button = screen.queryByText("Download (.zip 1.2MB)");
    expect(button).not.toBeInTheDocument;
  });
  it("should render a download button when logged in", () => {
    renderWithProviders()(
      <UnitDownloadButton
        setDownloadError={jest.fn()}
        setDownloadInProgress={jest.fn()}
        setShowDownloadMessage={jest.fn()}
        downloadInProgress={false}
        onDownloadSuccess={jest.fn()}
        unitProgrammeSlug="mockSlug"
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
        downloadInProgress={true}
        onDownloadSuccess={jest.fn()}
        unitProgrammeSlug="mockSlug"
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
        downloadInProgress={false}
        onDownloadSuccess={jest.fn()}
        unitProgrammeSlug="mockSlug"
      />,
    );
    const button = screen.getByText("Download unit");
    expect(button).toBeInTheDocument();
  });
  it("should set an error when the download fails", () => {
    const setDownloadError = jest.fn();
    renderWithProviders()(
      <UnitDownloadButton
        setDownloadError={setDownloadError}
        setDownloadInProgress={jest.fn()}
        setShowDownloadMessage={jest.fn()}
        downloadInProgress={false}
        onDownloadSuccess={jest.fn()}
        unitProgrammeSlug="mockSlug"
      />,
    );
    setDownloadError(true);
    expect(setDownloadError).toHaveBeenCalledWith(true);
  });
  it('should call "onDownloadSuccess" when the download is successful', () => {
    const onDownloadSuccess = jest.fn();
    renderWithProviders()(
      <UnitDownloadButton
        setDownloadError={jest.fn()}
        setDownloadInProgress={jest.fn()}
        setShowDownloadMessage={jest.fn()}
        downloadInProgress={false}
        onDownloadSuccess={onDownloadSuccess}
        unitProgrammeSlug="mockSlug"
      />,
    );
    onDownloadSuccess();
    expect(onDownloadSuccess).toHaveBeenCalledTimes(1);
  });
});
