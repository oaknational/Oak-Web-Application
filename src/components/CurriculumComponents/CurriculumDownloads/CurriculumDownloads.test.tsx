import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/dom";

import CurriculumDownloads from "./CurriculumDownloads";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("Component - Curriculum Header", () => {
  beforeEach(() => {
    jest.resetModules();
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
    await userEvent.type(schoolInput, "notavalidschool!?{enter}");
    await waitFor(() => {
      expect(getByTestId("errorList")).toBeInTheDocument();
    });
  });

  test("generates download error", async () => {
    const { getByTestId } = renderComponent();
    await userEvent.click(getByTestId("checkbox-download"));
    await userEvent.click(getByTestId("loadingButton"));
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
    await userEvent.click(resourceCard.querySelector("label")!);
    await userEvent.click(getByTestId("checkbox-download"));
    await userEvent.click(getByTestId("termsCheckbox").querySelector("label")!);
    await userEvent.click(getByTestId("loadingButton"));
    await waitFor(() => {
      expect(getByTestId("downloadSuccess")).toBeInTheDocument();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });
});
