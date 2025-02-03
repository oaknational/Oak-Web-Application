import { vi } from "vitest";
import { screen } from "@testing-library/react";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import UnitDownloadButton from "./UnitDownloadButton";

import { mockLoggedIn, mockLoggedOut } from "@/__tests__/__helpers__/mockUser";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";

vi.mock(
  "@/components/TeacherComponents/hooks/downloadAndShareHooks/useUnitDownloadExistenceCheck",
  () => ({
    default: vi.fn().mockReturnValue({
      exists: true,
      fileSize: "1.2MB",
      hasCheckedFiles: true,
    }),
  }),
);

vi.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: vi.fn(),
}));

vi.mock("@clerk/nextjs", async () => {
  return {
    useUser: vi.fn(),
    SignUpButton: () => <button>Download unit</button>,
  };
});

describe("UnitDownloadButton", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
    vi.mocked(useFeatureFlagVariantKey).mockReturnValue("option-a");
  });
  it("should not render when feature flag is off or control group", () => {
    vi.mocked(useFeatureFlagVariantKey).mockReturnValue("control");
    renderWithProviders()(
      <UnitDownloadButton
        setDownloadError={vi.fn()}
        setDownloadInProgress={vi.fn()}
        setShowDownloadMessage={vi.fn()}
        downloadInProgress={false}
        onDownloadSuccess={vi.fn()}
        unitFileId="mockSlug"
      />,
    );
    const button = screen.queryByText("Download (.zip 1.2MB)");
    expect(button).not.toBeInTheDocument();
  });

  it("should render a continue button when logged in but not onboarded", () => {
    setUseUserReturn({
      ...mockLoggedIn,
      user: {
        ...mockLoggedIn.user,
        publicMetadata: {
          owa: {
            isOnboarded: false,
          },
        },
      },
    });
    renderWithProviders()(
      <UnitDownloadButton
        setDownloadError={vi.fn()}
        setDownloadInProgress={vi.fn()}
        setShowDownloadMessage={vi.fn()}
        downloadInProgress={false}
        onDownloadSuccess={vi.fn()}
        unitFileId="mockSlug"
      />,
    );
    const button = screen.getByText("Complete sign up to download this unit");
    expect(button).toBeInTheDocument();
  });
  it("should render a download button when logged in", () => {
    renderWithProviders()(
      <UnitDownloadButton
        setDownloadError={vi.fn()}
        setDownloadInProgress={vi.fn()}
        setShowDownloadMessage={vi.fn()}
        downloadInProgress={false}
        onDownloadSuccess={vi.fn()}
        unitFileId="mockSlug"
      />,
    );
    const button = screen.getByText("Download (.zip 1.2MB)");
    expect(button).toBeInTheDocument();
  });
  it("should render loading text and spinner when download is in progress", () => {
    renderWithProviders()(
      <UnitDownloadButton
        setDownloadError={vi.fn()}
        setDownloadInProgress={vi.fn()}
        setShowDownloadMessage={vi.fn()}
        downloadInProgress={true}
        onDownloadSuccess={vi.fn()}
        unitFileId="mockSlug"
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
        setDownloadError={vi.fn()}
        setDownloadInProgress={vi.fn()}
        setShowDownloadMessage={vi.fn()}
        downloadInProgress={false}
        onDownloadSuccess={vi.fn()}
        unitFileId="mockSlug"
      />,
    );
    const button = screen.getByText("Download unit");
    expect(button).toBeInTheDocument();
  });
  it("should set an error when the download fails", () => {
    const setDownloadError = vi.fn();
    renderWithProviders()(
      <UnitDownloadButton
        setDownloadError={setDownloadError}
        setDownloadInProgress={vi.fn()}
        setShowDownloadMessage={vi.fn()}
        downloadInProgress={false}
        onDownloadSuccess={vi.fn()}
        unitFileId="mockSlug"
      />,
    );
    setDownloadError(true);
    expect(setDownloadError).toHaveBeenCalledWith(true);
  });
  it('should call "onDownloadSuccess" when the download is successful', () => {
    const onDownloadSuccess = vi.fn();
    renderWithProviders()(
      <UnitDownloadButton
        setDownloadError={vi.fn()}
        setDownloadInProgress={vi.fn()}
        setShowDownloadMessage={vi.fn()}
        downloadInProgress={false}
        onDownloadSuccess={onDownloadSuccess}
        unitFileId="mockSlug"
      />,
    );
    onDownloadSuccess();
    expect(onDownloadSuccess).toHaveBeenCalledTimes(1);
  });
});
