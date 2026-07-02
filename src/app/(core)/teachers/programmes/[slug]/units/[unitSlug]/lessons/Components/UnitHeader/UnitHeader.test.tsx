import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import UnitHeader, { UnitHeaderProps } from "./UnitHeader";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";

const track = {
  unitDownloadInitiated: jest.fn(),
};
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({ track }),
}));

const setCurrentToastProps = jest.fn();
jest.mock("@/context/OakNotifications/useOakNotificationsContext", () => ({
  useOakNotificationsContext: () => ({ setCurrentToastProps }),
}));

jest.mock(
  "@/components/TeacherComponents/hooks/downloadAndShareHooks/useUnitDownloadExistenceCheck",
  () =>
    jest.fn(() => ({
      exists: true,
      fileSize: "1.2MB",
      hasCheckedFiles: true,
    })),
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

const render = renderWithProviders();

const defaultProps: UnitHeaderProps = {
  heading: "Unit 1 in maths",
  phase: "primary",
  prevUnit: null,
  nextUnit: null,
  subjectIcon: "subject-maths",
  programmeSlug: "maths-ks4-higher",
  subjectPhaseSlug: "maths-secondary",
  trackingProps: {
    unitName: "IT and the world of work",
    unitSlug: "",
    keyStageSlug: "",
    keyStageTitle: "Key stage 4",
    subjectSlug: "computer-science",
    subjectTitle: "Computer science",
  },
  downloadButtonState: {
    downloadError: false,
    setDownloadError: jest.fn(),
    showDownloadMessage: false,
    setShowDownloadMessage: jest.fn(),
    downloadInProgress: false,
    setDownloadInProgress: jest.fn(),
    showIncompleteMessage: false,
    setShowIncompleteMessage: jest.fn(),
  },
};

const mockAdjacentUnit = {
  slug: "adjacent-unit",
  title: "Adjacent unit",
} as UnitHeaderProps["nextUnit"];

describe("UnitHeader", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
    jest.clearAllMocks();
  });

  it("renders a heading", () => {
    render(<UnitHeader {...defaultProps} />);

    const heading = screen.getByRole("heading", { name: defaultProps.heading });
    expect(heading).toBeInTheDocument();
  });

  it("renders previous and next unit links when adjacent units exist", () => {
    render(
      <UnitHeader
        {...defaultProps}
        phase="secondary"
        prevUnit={mockAdjacentUnit}
        nextUnit={mockAdjacentUnit}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Previous unit" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Next unit" })).toBeInTheDocument();
  });

  it("renders the download button when a download file id is provided", () => {
    render(<UnitHeader {...defaultProps} unitDownloadFileId="unit-file-id" />);

    expect(
      screen.getByRole("button", { name: /Download/ }),
    ).toBeInTheDocument();
  });

  it("tracks the download and shows a toast when the download succeeds", async () => {
    render(
      <UnitHeader
        {...defaultProps}
        unitDownloadFileId="unit-file-id"
        isGeorestrictedUnit={false}
      />,
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Download/ }));

    expect(track.unitDownloadInitiated).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: "owa",
        componentType: "unit_download_button",
        unitName: "IT and the world of work",
      }),
    );
    expect(setCurrentToastProps).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Download started. This may take a few minutes.",
        variant: "success",
      }),
    );
  });
});
