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

jest.mock("./helpers", () => ({
  downloadFileFromUrl: () => mockDownloadFileFromUrl(),
}));

const defaultProps = {
  hasCycle2Content: true,
  subjectSlug: "maths",
  subjectTitle: "Maths",
  phase: "primary",
  tierSlug: null,
  ks4OptionSlug: null,
  mvRefreshTime: 0,
};

const render = renderWithProviders();
describe("CurriculumDownloadBanner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders correctly when hasCycle2Content is true", () => {
    render(<CurriculumDownloadBanner {...defaultProps} />);

    const heading = screen.getByRole("heading", {
      name: "Fully resourced maths curriculum is coming this autumn.",
    });
    expect(heading).toBeInTheDocument();
    const downloadButton = screen.getByRole("button", {
      name: "Download curriculum plan",
    });
    expect(downloadButton).toBeInTheDocument();
  });
  it("does not render when hasCycle2Content is false", () => {
    render(
      <CurriculumDownloadBanner {...defaultProps} hasCycle2Content={false} />,
    );
    const heading = screen.queryByRole("heading", {
      name: "Fully resourced maths curriculum is coming this autumn.",
    });
    expect(heading).not.toBeInTheDocument();
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
    mockDownloadsLocalStorage.mockReturnValueOnce({
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

    await waitFor(() => expect(mockDownloadFileFromUrl).toHaveBeenCalled);
  });
});
