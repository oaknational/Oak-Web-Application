import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/dom";

import CurriculumDownloads from "./CurriculumDownloads";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import createAndClickHiddenDownloadLink from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";

jest.mock(
  "@/components/TeacherComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink",
  () => ({
    __esModule: true,
    default: jest.fn(),
    createAndClickHiddenDownloadLink: jest.fn(),
  }),
);

const render = renderWithProviders();

describe("Component - Curriculum Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    const defaultProps = {
      category: "test-category",
      downloads: [
        {
          icon: "french",
          label: "Test Label",
          url: "https://test-url.com",
        },
      ],
    };

    return render(<CurriculumDownloads {...defaultProps} />);
  };

  test("renders download cards", async () => {
    const { findAllByLabelText } = renderComponent();
    const cards = await findAllByLabelText("Test Label");
    expect(cards).toHaveLength(1);
  });

  test("generates school error", async () => {
    const { getByTestId } = renderComponent();
    const schoolInput = getByTestId("search-combobox-input");
    userEvent.type(schoolInput, "notavalidschool!?{enter}");
    await waitFor(() => {
      expect(getByTestId("errorList")).toBeInTheDocument();
    });
  });

  test("generates email error", async () => {
    const { getByTestId } = renderComponent();
    const emailInput = getByTestId("inputEmail");
    userEvent.type(emailInput, "notavalidemail!?{tab}");
    await waitFor(() => {
      expect(getByTestId("errorList")).toBeInTheDocument();
    });
  });

  test("generates download error", async () => {
    const { getByTestId } = renderComponent();
    userEvent.click(getByTestId("checkbox-download"));
    userEvent.click(getByTestId("loadingButton"));
    await waitFor(() => {
      expect(getByTestId("errorList")).toBeInTheDocument();
    });
  });

  test("submits form when correct information is entered", async () => {
    const { getAllByTestId, getByTestId } = renderComponent();
    const resourceCard = getAllByTestId("resourceCard")[0];
    if (resourceCard === undefined) {
      throw new Error("Resource card not found");
    }
    userEvent.click(resourceCard.querySelector("label")!);
    userEvent.click(getByTestId("checkbox-download"));
    userEvent.click(getByTestId("termsCheckbox").querySelector("label")!);
    userEvent.click(getByTestId("loadingButton"));
    await waitFor(() => {
      expect(createAndClickHiddenDownloadLink).toHaveBeenCalled();
      expect(getByTestId("downloadSuccess")).toBeInTheDocument();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });
});
