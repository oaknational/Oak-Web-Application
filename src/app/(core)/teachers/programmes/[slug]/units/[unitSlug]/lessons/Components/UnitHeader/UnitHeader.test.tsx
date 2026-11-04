import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import UnitHeader, { UnitHeaderProps } from "./UnitHeader";
import { useStickyUnitHeader } from "./useStickyUnitHeader";

import renderWithProviders, {
  allProviders,
} from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";
import { getProgrammeStateForUnit } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";
import teachersUnitOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersUnitOverview.fixture";

const track = {
  unitDownloaded: jest.fn(),
  unitAccessed: jest.fn(),
};
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({ track, getSessionId: jest.fn() }),
}));

const setCurrentToastProps = jest.fn();
jest.mock("@/context/OakNotifications/useOakNotificationsContext", () => ({
  useOakNotificationsContext: () => ({ setCurrentToastProps }),
}));

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

jest.mock("./useStickyUnitHeader", () => ({
  useStickyUnitHeader: jest.fn(() => ({
    sentinelRef: { current: null },
    isStuck: false,
  })),
}));

const renderUnitHeader = (props?: Partial<UnitHeaderProps>) => {
  return renderWithProviders()(<UnitHeader {...defaultProps} {...props} />);
};

const defaultProps: UnitHeaderProps = {
  heading: "Unit 1 in maths",
  phase: "primary",
  prevUnit: null,
  nextUnit: null,
  subjectIcon: "subject-maths",
  programmeSlug: "maths-ks4-higher",
  subjectPhaseSlug: "maths-secondary",
  unitDownloadExistence: {
    checkFailed: false,
    exists: true,
    fileSize: "1.2MB",
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

const mockedUseStickyUnitHeader = jest.mocked(useStickyUnitHeader);

describe("UnitHeader", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
    jest.clearAllMocks();
  });

  it("renders a heading", () => {
    renderUnitHeader();
    const heading = screen.getByRole("heading", { name: defaultProps.heading });
    expect(heading).toBeInTheDocument();
  });

  it("renders previous and next unit links when adjacent units exist", () => {
    renderUnitHeader({
      phase: "secondary",
      prevUnit: mockAdjacentUnit,
      nextUnit: mockAdjacentUnit,
    });

    expect(
      screen.getByRole("link", { name: "Previous unit" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Next unit" })).toBeInTheDocument();
  });

  it("tracks unitAccessed on next and previous lesson links", async () => {
    renderWithProviders({
      ...allProviders,
      teacherBrowseAnalytics: {
        programmeState: getProgrammeStateForUnit(teachersUnitOverviewFixture()),
        accessLevel: "unit",
      },
    })(
      <UnitHeader
        {...defaultProps}
        prevUnit={{
          slug: "unit-2",
          title: "Previous unit",
        }}
        nextUnit={{
          slug: "unit-4",
          title: "Next unit",
        }}
      />,
    );
    const nextUnitLink = screen.getByRole("link", { name: /Next unit/i });
    nextUnitLink.addEventListener("click", (e) => e.preventDefault());
    const user = userEvent.setup();
    await user.click(nextUnitLink);
    expect(track.unitAccessed).toHaveBeenCalledWith(
      expect.objectContaining({ unitSlug: "unit-4" }),
    );

    const prevUnitLink = screen.getByRole("link", {
      name: /Previous unit/i,
    });
    prevUnitLink.addEventListener("click", (e) => e.preventDefault());
    await user.click(prevUnitLink);
    expect(track.unitAccessed).toHaveBeenLastCalledWith(
      expect.objectContaining({ unitSlug: "unit-2" }),
    );
  });

  it("renders the download button when a download file id is provided", () => {
    renderUnitHeader({ unitDownloadFileId: "unit-file-id" });

    expect(
      screen.getByRole("button", { name: /Download/ }),
    ).toBeInTheDocument();
  });

  it("tracks the download and shows a toast when the download succeeds", async () => {
    renderUnitHeader({
      unitDownloadFileId: "unit-file-id",
      isGeorestrictedUnit: false,
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Download/ }));

    expect(track.unitDownloaded).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: "owa",
        componentType: "unit_download_button",
        unitName: "Cells",
      }),
    );
    expect(setCurrentToastProps).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Download started. This may take a few minutes.",
        variant: "success",
      }),
    );
  });

  describe("Sticky Nav Footer", () => {
    it("renders unstuck by default", () => {
      renderUnitHeader({ unitDownloadFileId: "unit-file-id" });

      const footer = screen.getByTestId("unit-header-nav-footer");
      expect(footer).toHaveAttribute("data-stuck", "false");
      expect(
        screen.queryByTestId("unit-header-nav-footer-placeholder"),
      ).not.toBeInTheDocument();
    });

    it("renders stuck output when hook returns stuck", () => {
      mockedUseStickyUnitHeader.mockReturnValueOnce({
        sentinelRef: { current: null },
        isStuck: true,
      });

      renderUnitHeader({ unitDownloadFileId: "unit-file-id" });

      const footer = screen.getByTestId("unit-header-nav-footer");
      expect(footer).toHaveAttribute("data-stuck", "true");
      expect(
        screen.getByTestId("unit-header-nav-footer-placeholder"),
      ).toBeInTheDocument();
    });
  });
});
