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

  describe("Form submission", () => {
    const onHubspotSubmit = jest.fn();
    const setIsAttemptingDownload = jest.fn();
    const setApiError = jest.fn();

    const curriculumResourcesDownloaded = jest.fn();
    jest.mock("@/context/Analytics/useAnalytics", () => ({
      default: () => ({
        track: {
          curriculumResourcesDownloaded: jest.fn(),
        },
        identify: jest.fn(),
      }),
    }));

    jest.mock(
      "@/components/TeacherComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink",
      () => ({
        createAndClickHiddenDownloadLink: jest.fn(),
      }),
    );

    const setSchoolInLocalStorage = jest.fn();
    const setEmailInLocalStorage = jest.fn();
    const setTermsInLocalStorage = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("generates school error", async () => {
      const { getByTestId } = renderComponent();
      const schoolInput = getByTestId("search-combobox-input");
      userEvent.click(schoolInput);
      userEvent.type(schoolInput, "notavalidschool!?");
      userEvent.keyboard("{enter}");
      waitFor(() => {
        expect(getByTestId("errorList")).toBeInTheDocument();
      });
    });

    test("generates email error", async () => {
      const { getByTestId } = renderComponent();
      const emailInput = getByTestId("inputEmail");
      userEvent.click(emailInput);
      userEvent.type(emailInput, "notavalidemail!?{enter}");
      waitFor(() => {
        expect(getByTestId("errorList")).toBeInTheDocument();
      });
    });

    test("generates download error", async () => {
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

    test("submits form when correct information is entered", async () => {
      const { getByTestId } = renderComponent();
      const schoolInput = getByTestId("search-combobox-input");
      userEvent.click(schoolInput);
      userEvent.type(schoolInput, "Test School");
      const emailInput = getByTestId("inputEmail");
      userEvent.click(emailInput);
      userEvent.type(emailInput, "valid-test-email@thenational.academy");
      waitFor(async () => {
        const button = getByTestId("downloadButton");
        userEvent.click(button);
        await waitFor(() => {
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
          expect(setEmailInLocalStorage).toHaveBeenCalledWith(
            "valid-test-email.thenational.academy",
          );
          expect(setTermsInLocalStorage).toHaveBeenCalledWith(true);
          expect(curriculumResourcesDownloaded).toHaveBeenCalled();
        });
      });
    });
  });
});
