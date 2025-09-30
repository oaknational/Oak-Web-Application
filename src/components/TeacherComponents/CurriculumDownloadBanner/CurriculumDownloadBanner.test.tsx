import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import CurriculumDownloadBanner from "./CurriculumDownloadBanner";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const mockDownloadsLocalStorage = jest.fn().mockReturnValue({
  data: {
    isComplete: false,
    schoolId: undefined,
    schoolName: undefined,
    schoolNotListed: false,
    email: undefined,
    termsAndConditions: false,
  },
  isLoading: false,
});

jest.mock("../../CurriculumComponents/CurriculumDownloadTab/helper", () => ({
  useDownloadsLocalStorage: () => mockDownloadsLocalStorage(),
  saveDownloadsDataToLocalStorage: jest.fn(),
}));

const mockDownloadFileFromUrl = jest.fn();

jest.mock("@/components/SharedComponents/helpers/downloadFileFromUrl", () => ({
  downloadFileFromUrl: (downloadFilePath: string) =>
    mockDownloadFileFromUrl(downloadFilePath),
}));

const mockTrackCurriculumDownload = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      curriculumResourcesDownloaded: (...args: unknown[]) =>
        mockTrackCurriculumDownload(...args),
    },
  }),
}));

const defaultProps = {
  subjectSlug: "maths",
  subjectTitle: "Maths",
  phaseSlug: "primary",
  tierSlug: null,
  ks4OptionSlug: null,
  mvRefreshTime: 0,
  pathwaySlug: null,
  childSubjectSlug: null,
};

const render = renderWithProviders();
describe("CurriculumDownloadBanner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders correctly when hasCycle2Content is true", () => {
    render(<CurriculumDownloadBanner {...defaultProps} />);

    const heading = screen.getByRole("heading", {
      name: "New fully-sequenced curriculum plan and lesson resources for Maths.",
    });
    expect(heading).toBeInTheDocument();
    const downloadButton = screen.getByRole("button", {
      name: "Download curriculum plan",
    });
    expect(downloadButton).toBeInTheDocument();
  });
  it("links to the curriculum downloads page when no saved details", async () => {
    render(<CurriculumDownloadBanner {...defaultProps} />);

    const link = screen.getByRole("link");

    expect(link).toHaveAttribute(
      "href",
      "/teachers/curriculum/maths-primary/downloads",
    );

    const downloadButton = screen.getByRole("button", {
      name: "Download curriculum plan",
    });
    const user = userEvent.setup();
    await user.click(downloadButton);
    await waitFor(() => {
      expect(mockDownloadFileFromUrl).not.toHaveBeenCalled();
    });
  });
  it("calls onSubmit when download button is clicked and has saved details", async () => {
    mockDownloadsLocalStorage.mockReturnValue({
      data: {
        isComplete: true,
        schoolId: "123",
        schoolName: "Test School",
        schoolNotListed: false,
        email: "email.com",
        termsAndConditions: true,
      },
      isLoading: false,
    });

    render(<CurriculumDownloadBanner {...defaultProps} />);
    const downloadButton = screen.getByRole("button", {
      name: "Download curriculum plan",
    });
    const user = userEvent.setup();
    await user.click(downloadButton);

    await waitFor(() =>
      expect(mockDownloadFileFromUrl).toHaveBeenCalledWith(
        "/api/curriculum-downloads/?types=curriculum-plans&mvRefreshTime=0&subjectSlug=maths&phaseSlug=primary&state=published",
      ),
    );
  });
  it("generates the correct query for programmes with pathways", async () => {
    mockDownloadsLocalStorage.mockReturnValue({
      data: {
        isComplete: true,
        schoolId: "123",
        schoolName: "Test School",
        schoolNotListed: false,
        email: "email.com",
        termsAndConditions: true,
      },
      isLoading: false,
    });
    render(<CurriculumDownloadBanner {...defaultProps} pathwaySlug="core" />);

    const downloadButton = screen.getByRole("button", {
      name: "Download curriculum plan",
    });
    const user = userEvent.setup();
    await user.click(downloadButton);

    await waitFor(() =>
      expect(mockDownloadFileFromUrl).toHaveBeenCalledWith(
        "/api/curriculum-downloads/?types=curriculum-plans&mvRefreshTime=0&subjectSlug=maths&phaseSlug=primary&state=published&ks4OptionSlug=core",
      ),
    );
  });
  it("calls onSubmit with the correct parameters when childSubjectSlug is provided", async () => {
    mockDownloadsLocalStorage.mockReturnValue({
      data: {
        isComplete: true,
        schoolId: "123",
        schoolName: "Test School",
        schoolNotListed: false,
        email: "email.com",
        termsAndConditions: true,
      },
      isLoading: false,
    });
    render(
      <CurriculumDownloadBanner
        {...defaultProps}
        subjectSlug="science"
        childSubjectSlug="biology"
      />,
    );

    const downloadButton = screen.getByRole("button", {
      name: "Download curriculum plan",
    });
    const user = userEvent.setup();
    await user.click(downloadButton);

    await waitFor(() =>
      expect(mockDownloadFileFromUrl).toHaveBeenCalledWith(
        "/api/curriculum-downloads/?types=curriculum-plans&mvRefreshTime=0&subjectSlug=science&phaseSlug=primary&state=published&childSubjectSlug=biology",
      ),
    );
  });
  it("tracks curriculum resources downloaded when download button is clicked", async () => {
    mockDownloadsLocalStorage.mockReturnValue({
      data: {
        isComplete: true,
        schoolId: "123",
        schoolName: "Test School",
        schoolNotListed: false,
        email: "email.com",
        termsAndConditions: true,
      },
      isLoading: false,
    });
    render(<CurriculumDownloadBanner {...defaultProps} />);

    const downloadButton = screen.getByRole("button", {
      name: "Download curriculum plan",
    });
    const user = userEvent.setup();
    await user.click(downloadButton);

    expect(mockTrackCurriculumDownload).toHaveBeenCalledWith({
      analyticsUseCase: "Teacher",
      componentType: "unit_download_button",
      emailSupplied: true,
      engagementIntent: "explore",
      eventVersion: "2.0.0",
      keyStageSlug: null,
      keyStageTitle: null,
      phase: "primary",
      platform: "owa",
      product: "curriculum resources",
      resourceType: ["curriculum document"],
      schoolName: "Test School",
      schoolOption: "Selected school",
      schoolUrn: "",
      subjectTitle: "Maths",
    });
  });
  it("should show an error toast if the download fails", async () => {
    mockDownloadsLocalStorage.mockReturnValue({
      data: {
        isComplete: true,
        schoolId: "123",
        schoolName: "Test School",
        schoolNotListed: false,
        email: "email.com",
        termsAndConditions: true,
      },
      isLoading: false,
    });
    mockDownloadFileFromUrl.mockRejectedValue(new Error("Download failed"));

    render(<CurriculumDownloadBanner {...defaultProps} />);

    const downloadButton = screen.getByRole("button", {
      name: "Download curriculum plan",
    });
    const user = userEvent.setup();
    await user.click(downloadButton);

    await waitFor(() => {
      expect(
        screen.getByText("Something went wrong with your download"),
      ).toBeInTheDocument();
    });
  });
});
