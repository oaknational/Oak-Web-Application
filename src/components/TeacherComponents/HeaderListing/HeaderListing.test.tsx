import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import HeaderListing, { HeaderListingProps } from "./HeaderListing";
import { headerListingProps } from "./HeaderListing.stories";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";

const props = headerListingProps as unknown as HeaderListingProps;

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
jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: jest.fn(() => "option-a"),
}));

describe("HeaderListing", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    global.fetch = jest.fn(() => Promise.resolve({})) as jest.Mock;
  });
  it("renders the title with the correct level", () => {
    const { getAllByRole } = renderWithTheme(<HeaderListing {...props} />);
    const subjectHeading = getAllByRole("heading", { level: 1 });
    expect(subjectHeading).toHaveLength(1);
    expect(subjectHeading[0]).toHaveTextContent("English");
  });
  it("doesnt render unit download button", () => {
    renderWithTheme(<HeaderListing {...props} />);
    const unitDownloadButton = screen.queryByRole("button");
    expect(unitDownloadButton).not.toBeInTheDocument();
  });
  it('renders a unit download button when "unitDownloadFileId" and "onUnitDownloadSuccess" is provided', () => {
    setUseUserReturn(mockLoggedIn);
    renderWithTheme(
      <HeaderListing
        {...props}
        unitDownloadFileId="123"
        onUnitDownloadSuccess={jest.fn}
      />,
    );
    const unitDownloadButton = screen.getByRole("button");
    expect(unitDownloadButton).toBeInTheDocument();
  });
  it("renders an alert banner when show download message is true", async () => {
    setUseUserReturn(mockLoggedIn);
    renderWithTheme(
      <HeaderListing
        {...props}
        unitDownloadFileId="123"
        onUnitDownloadSuccess={jest.fn}
      />,
    );
    const unitDownloadButton = screen.getByRole("button");
    userEvent.click(unitDownloadButton);
    const banner = await screen.findByText(
      "Downloads may take a few minutes on slower Wi-Fi connections.",
    );
    expect(banner).toBeInTheDocument();
  });
  it("renders RiskAssessmentBanner if showRiskAssessmentBanner prop is set to true", async () => {
    renderWithTheme(
      <HeaderListing {...props} showRiskAssessmentBanner={true} />,
    );
    const banner = await screen.findByText("for all practical PE lessons", {
      exact: false,
    });
    expect(banner).toBeInTheDocument();
  });
  it("does not render RiskAssessmentBanner if showRiskAssessmentBanner prop is set to false", async () => {
    renderWithTheme(
      <HeaderListing {...props} showRiskAssessmentBanner={false} />,
    );
    const banner = await screen.queryByText("for all practical PE lessons", {
      exact: false,
    });
    expect(banner).not.toBeInTheDocument();
  });
});
