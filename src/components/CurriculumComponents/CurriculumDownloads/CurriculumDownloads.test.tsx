import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/dom";
import { debounce } from "lodash";

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

  describe("Form submission", () => {
    const onHubspotSubmit = jest.fn();
    const setIsAttemptingDownload = jest.fn();
    const setApiError = jest.fn();
    const setSchoolInLocalStorage = jest.fn();
    const setTermsInLocalStorage = jest.fn();

    jest.mock("lodash", () => ({
      debounce: jest.fn((fn) => fn),
    }));

    const curriculumResourcesDownloaded = jest.fn();
    jest.mock("@/context/Analytics/useAnalytics", () => ({
      default: () => ({
        track: {
          curriculumResourcesDownloaded: (...args: unknown[]) =>
            curriculumResourcesDownloaded(...args),
        },
        identify: () => {},
      }),
    }));

    test("submits form when correct information is entered", async () => {
      const { getByTestId } = renderComponent();
      const schoolInput = getByTestId("search-combobox-input");
      userEvent.click(schoolInput);
      userEvent.type(schoolInput, "Test School");
      waitFor(async () => {
        const button = getByTestId("downloadButton");
        userEvent.click(button);
        await waitFor(() => {
          expect(debounce).toHaveBeenCalled();
          expect(onHubspotSubmit).toHaveBeenCalled();
          expect(createAndClickHiddenDownloadLink).toHaveBeenCalledWith(
            "https://test-url.com",
          );
          expect(setIsAttemptingDownload).toHaveBeenLastCalledWith(false);
          expect(setApiError).not.toHaveBeenCalled();
          expect(setSchoolInLocalStorage).toHaveBeenCalledWith(
            "Test School",
            "Test School",
          );
          expect(setTermsInLocalStorage).toHaveBeenCalledWith(true);
          expect(curriculumResourcesDownloaded).toHaveBeenCalled();
        });
      });
    });
  });
});
