import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/dom";

import CurriculumDownloads from "./CurriculumDownloads";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import createAndClickHiddenDownloadLink from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";

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

  test("generates form errors", async () => {
    const { getByTestId } = renderComponent();
    waitFor(async () => {
      const button = getByTestId("downloadButton");
      expect(button).toBeInTheDocument();
      userEvent.click(button);
      await waitFor(() => {
        expect(getByTestId("downloadError")).toBeInTheDocument();
      });
    });
  });

  const onHubspotSubmit = jest.fn();

  test("submits form when correct information is entered", async () => {
    const { getByTestId } = renderComponent();
    const schoolInput = getByTestId("search-combobox-input");
    userEvent.click(schoolInput);
    userEvent.type(schoolInput, "Test School");
    waitFor(async () => {
      const button = getByTestId("downloadButton");
      userEvent.click(button);
      await waitFor(() => {
        expect(onHubspotSubmit).toHaveBeenCalled();
        expect(createAndClickHiddenDownloadLink).toHaveBeenCalled();
      });
    });
  });
});
