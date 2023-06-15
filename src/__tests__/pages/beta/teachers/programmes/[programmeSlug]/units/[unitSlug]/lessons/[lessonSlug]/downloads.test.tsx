import { renderHook, screen, act, waitFor } from "@testing-library/react";
import { GetStaticPropsContext, PreviewData } from "next";
import { useForm } from "react-hook-form";
import userEvent from "@testing-library/user-event";
import { computeAccessibleDescription } from "dom-accessibility-api";
import React from "react";

import curriculumApi from "../../../../../../../../../../node-lib/curriculum-api/__mocks__";
import waitForNextTick from "../../../../../../../../../__helpers__/waitForNextTick";
import renderWithSeo from "../../../../../../../../../__helpers__/renderWithSeo";
import { mockSeoResult } from "../../../../../../../../../__helpers__/cms";
import renderWithProviders from "../../../../../../../../../__helpers__/renderWithProviders";
import "../../../../../../../../../__helpers__/LocalStorageMock";
import LessonDownloadsPage, {
  getStaticPaths,
  getStaticProps,
  LessonDownloadsPageProps,
  URLParams,
} from "../../../../../../../../../../pages/beta/[viewType]/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/downloads";
import useLocalStorageForDownloads from "../../../../../../../../../../components/DownloadComponents/hooks/useLocalStorageForDownloads";
import lessonDownloadsFixtures from "../../../../../../../../../../node-lib/curriculum-api/fixtures/lessonDownloads.fixture";

const props = {
  curriculumData: lessonDownloadsFixtures(),
};

const getDownloadResourcesExistenceData = {
  resources: {
    "exit-quiz-answers": true,
    "worksheet-pdf": true,
  },
};

jest.mock("next/dist/client/router", () => require("next-router-mock"));
jest.mock(
  "../../../../../../../../../../components/DownloadComponents/helpers/getDownloadResourcesExistence",
  () => ({
    __esModule: true,
    default: () => getDownloadResourcesExistenceData,
  })
);

jest.mock(
  "../../../../../../../../../../components/DownloadComponents/hooks/useDownloadExistenceCheck",
  () => {
    return jest.fn();
  }
);

beforeEach(() => {
  renderHook(() => useForm());
  localStorage.clear();
});

const render = renderWithProviders();

describe("pages/beta/teachers/lessons/[lessonSlug]/downloads", () => {
  it("Renders title from the props with added 'Downloads' text in front of it", () => {
    render(<LessonDownloadsPage {...props} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Downloads: Islamic Geometry"
    );
  });
  it("Renders 'no downloads available' message if there is no downloads", () => {
    render(
      <LessonDownloadsPage
        {...{
          curriculumData: {
            ...props.curriculumData,
            downloads: [],
          },
        }}
      />
    );

    expect(screen.getByText("No downloads available")).toBeInTheDocument();
  });

  it("Renders 'no downloads available' message if there is no downloads", () => {
    render(
      <LessonDownloadsPage
        {...{
          curriculumData: {
            ...props.curriculumData,
            downloads: [],
          },
        }}
      />
    );

    expect(screen.getByText("No downloads available")).toBeInTheDocument();
  });

  describe("download form", () => {
    it("Renders download form with correct elements", () => {
      render(<LessonDownloadsPage {...props} />);

      expect(screen.getAllByRole("heading", { level: 2 })[0]).toHaveTextContent(
        "Your details"
      );
      expect(screen.getByTestId("email-heading")).toHaveTextContent(
        "For regular updates from Oak (optional)"
      );
      expect(
        screen.getByPlaceholderText("Enter email address here")
      ).toBeInTheDocument();

      // Privacy policy link
      const privacyPolicyLink = screen.getByRole("link", {
        name: "privacy policy",
      });
      expect(privacyPolicyLink).toBeInTheDocument();
      expect(privacyPolicyLink).toHaveAttribute(
        "href",
        "/legal/privacy-policy"
      );

      // Terms and conditions checkbox
      expect(
        screen.getByLabelText("I accept terms and conditions (required)")
      ).toBeInTheDocument();

      // Terms and conditions link
      const tcsLink = screen.getByRole("link", {
        name: "terms & conditions",
      });
      expect(tcsLink).toBeInTheDocument();
      expect(tcsLink).toHaveAttribute("href", "/legal/terms-and-conditions");

      // Lesson resources to download
      const lessonResourcesToDownload = screen.getAllByTestId(
        "lessonResourcesToDownload"
      );
      expect(lessonResourcesToDownload.length).toEqual(2);
      const exitQuizQuestions = screen.getByLabelText("Exit quiz questions");

      expect(exitQuizQuestions).toBeInTheDocument();
      expect(exitQuizQuestions).toHaveAttribute("name", "downloads");
      expect(exitQuizQuestions).toHaveAttribute("value", "exit-quiz-questions");

      // Download button
      const downloadButton = screen.getByText("Download .zip");
      expect(downloadButton).toBeInTheDocument();
    });

    it("should display error hint on blur email if not formatted correctly", async () => {
      const { getByPlaceholderText } = render(
        <LessonDownloadsPage {...props} />
      );

      const input = getByPlaceholderText("Enter email address here");
      const user = userEvent.setup();
      await user.click(input);
      await user.keyboard("not an email");
      await user.tab();

      // HACK: wait for next tick
      await waitForNextTick();

      const description = computeAccessibleDescription(input);
      expect(description).toBe("Please enter a valid email address");
    });

    it("should not display error hint on blur email if empty", async () => {
      const { getByPlaceholderText } = render(
        <LessonDownloadsPage {...props} />
      );

      const input = getByPlaceholderText("Enter email address here");
      const user = userEvent.setup();
      await user.click(input);
      await user.tab();

      // HACK: wait for next tick
      await waitForNextTick();

      const description = computeAccessibleDescription(input);
      expect(description).toBe("");
    });
  });

  describe("selected resources count", () => {
    it("should display correct count of selected and all downloadable resources if no resources are selected", () => {
      const { getByTestId } = render(<LessonDownloadsPage {...props} />);

      const selectedResourcesCount = getByTestId("selectedResourcesCount");
      expect(selectedResourcesCount).toHaveTextContent("2/2 files selected");
    });

    it.skip("should display correct count of selected and all downloadable resources if some resources are selected", async () => {
      const { getByTestId, getByLabelText } = render(
        <LessonDownloadsPage {...props} />
      );

      const exitQuizQuestions = getByLabelText("Exit quiz questions");
      const user = userEvent.setup();
      await user.click(exitQuizQuestions);

      const selectedResourcesCount = getByTestId("selectedResourcesCount");
      expect(selectedResourcesCount).toHaveTextContent("1/2 files selected");
    });

    it("should select all resources if user clicks 'Select all'", async () => {
      const { getByTestId, getByText } = render(
        <LessonDownloadsPage {...props} />
      );

      const selectAllButton = getByText("Select all");
      const user = userEvent.setup();
      await user.click(selectAllButton);

      const selectedResourcesCount = getByTestId("selectedResourcesCount");
      expect(selectedResourcesCount).toHaveTextContent("2/2 files selected");

      const exitQuizQuestions = screen.getByLabelText("Exit quiz questions");
      const exitQuizAnswers = screen.getByLabelText("Exit quiz answers");

      expect(exitQuizQuestions).toBeChecked();
      expect(exitQuizAnswers).toBeChecked();
    });

    it("should deselect all resources if user clicks 'Deselect all'", async () => {
      const { getByTestId, getByText } = render(
        <LessonDownloadsPage {...props} />
      );

      const deselectAllButton = getByText("Deselect all");
      const user = userEvent.setup();
      await user.click(deselectAllButton);

      const selectedResourcesCount = getByTestId("selectedResourcesCount");
      expect(selectedResourcesCount).toHaveTextContent("0/2 files selected");

      const exitQuizQuestions = screen.getByLabelText("Exit quiz questions");
      const exitQuizAnswers = screen.getByLabelText("Exit quiz answers");
      expect(exitQuizQuestions).not.toBeChecked();
      expect(exitQuizAnswers).not.toBeChecked();
    });
  });

  describe("renders details saved in local storage", () => {
    it("renders DetailsCompleted component with email filled from local storage if available", async () => {
      const { result } = renderHook(() => useLocalStorageForDownloads());

      act(() => {
        result.current.setEmailInLocalStorage("test@test.com");
        result.current.setTermsInLocalStorage(true);
      });

      const { getByText } = render(<LessonDownloadsPage {...props} />);

      expect(getByText("email: test@test.com")).toBeInTheDocument();
    });

    it("displays DetailsCompleted component with school name filled from local storage if available", async () => {
      const { result } = renderHook(() => useLocalStorageForDownloads());

      act(() => {
        result.current.setSchoolInLocalStorage({
          schoolName: "Primary School",
          schoolId: "222-Primary School",
        });
        result.current.setTermsInLocalStorage(true);
      });

      const { getByText } = render(<LessonDownloadsPage {...props} />);

      expect(getByText("school: Primary School")).toBeInTheDocument();
    });
  });

  describe("details on the form prefilled correctly when user clicks 'Edit' button on DetailsComplete component", () => {
    it("marks Terms and Conditions as checked if saved in local storage", async () => {
      const { result } = renderHook(() => useLocalStorageForDownloads());

      act(() => {
        result.current.setEmailInLocalStorage("test@test.com");
        result.current.setTermsInLocalStorage(true);
      });

      const { getByText, getByLabelText } = render(
        <LessonDownloadsPage {...props} />
      );

      // user click Edit button
      const editButton = getByText("Edit");

      const user = userEvent.setup();
      await user.click(editButton);

      const terms = getByLabelText("I accept terms and conditions (required)");

      await waitFor(() => {
        expect(terms).toBeChecked();
      });
    });

    it("prefills email from saved in local storage", async () => {
      const { result } = renderHook(() => useLocalStorageForDownloads());

      act(() => {
        result.current.setEmailInLocalStorage("test@test.com");
        result.current.setTermsInLocalStorage(true);
      });

      const { getByText, getByLabelText, getByDisplayValue } = render(
        <LessonDownloadsPage {...props} />
      );

      // user click Edit button
      const editButton = getByText("Edit");
      const user = userEvent.setup();
      await user.click(editButton);

      const emailAddress = result.current.emailFromLocalStorage;
      expect(getByLabelText("Email address")).toBeInTheDocument();
      const emailValue = getByDisplayValue(emailAddress);
      expect(emailValue).toBeInTheDocument();
      expect(emailAddress).toBe("test@test.com");
    });

    it("prefills school with the correct school name if school id is saved in local storage", async () => {
      const { result } = renderHook(() => useLocalStorageForDownloads());

      act(() => {
        result.current.setSchoolInLocalStorage({
          schoolName: "Primary School",
          schoolId: "222-Primary-School",
        });
        result.current.setTermsInLocalStorage(true);
      });

      const { getByText, getByTestId } = render(
        <LessonDownloadsPage {...props} />
      );

      // user click Edit button
      const editButton = getByText("Edit");
      const user = userEvent.setup();
      await user.click(editButton);

      const schoolId = result.current.schoolFromLocalStorage.schoolId;
      const schoolName = result.current.schoolFromLocalStorage.schoolName;

      const schoolPicker = getByTestId("search-combobox-input");
      await waitFor(() => {
        expect(schoolPicker).toBeInTheDocument();
        expect(schoolPicker).toHaveValue("Primary School");
      });

      expect(schoolId).toBe("222-Primary-School");
      expect(schoolName).toBe("Primary School");
    });
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo()(<LessonDownloadsPage {...props} />);

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Lesson Download: Islamic Geometry | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Lesson downloads",
        ogTitle:
          "Lesson Download: Islamic Geometry | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Lesson downloads",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });
  });
  describe("getStaticPaths", () => {
    it("should fetch the correct data", async () => {
      await getStaticPaths();
      expect(curriculumApi.lessonDownloadPaths).toHaveBeenCalledTimes(1);
    });
  });
  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getStaticProps({
        params: {
          lessonSlug: "macbeth-lesson-1",
          programmeSlug: "math-higher-ks4",
          unitSlug: "shakespeare",
          viewType: "teachers",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: LessonDownloadsPageProps;
      };

      expect(propsResult.props.curriculumData.lessonSlug).toEqual(
        "macbeth-lesson-1"
      );
    });
    it("should throw error", async () => {
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>)
      ).rejects.toThrowError("No context.params");
    });
  });
});
