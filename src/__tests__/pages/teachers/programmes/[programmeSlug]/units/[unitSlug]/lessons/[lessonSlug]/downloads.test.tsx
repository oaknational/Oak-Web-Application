import { renderHook, screen, act, waitFor } from "@testing-library/react";
import { GetStaticPropsContext, PreviewData } from "next";
import { useForm } from "react-hook-form";
import userEvent from "@testing-library/user-event";
import { computeAccessibleDescription } from "dom-accessibility-api";
import React from "react";

import waitForNextTick from "@/__tests__/__helpers__/waitForNextTick";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import "@/__tests__/__helpers__/LocalStorageMock";
import useLocalStorageForDownloads from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useLocalStorageForDownloads";
import lessonDownloadsFixtures from "@/node-lib/curriculum-api/fixtures/lessonDownloads.fixture";
import lessonDownloadsFixtures2023 from "@/node-lib/curriculum-api-2023/fixtures/lessonDownloads.fixture";
import LessonDownloadsPage, {
  LessonDownloadsPageProps,
  URLParams,
  getStaticPaths,
  getStaticProps,
} from "@/pages/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/downloads";
import OakError from "@/errors/OakError";

const props: LessonDownloadsPageProps = {
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
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence",
  () => ({
    __esModule: true,
    default: () => getDownloadResourcesExistenceData,
  }),
);

jest.mock(
  "@/components/TeacherComponents/helpers/downloadAndShareHelpers/downloadDebounceSubmit",
  () => ({
    __esModule: true,
    default: () => {
      throw new OakError({ code: "downloads/failed-to-fetch" });
    },
  }),
);

jest.mock(
  "@/components/TeacherComponents/hooks/downloadAndShareHooks/useDownloadExistenceCheck",
  () => {
    return jest.fn();
  },
);

beforeEach(() => {
  renderHook(() => useForm());
  localStorage.clear();
});
const render = renderWithProviders();

describe("pages/teachers/lessons/[lessonSlug]/downloads", () => {
  it("Renders 'no downloads available' message if there is no downloads", () => {
    render(
      <LessonDownloadsPage
        {...{
          ...props,
          curriculumData: {
            ...props.curriculumData,
            downloads: [],
          },
        }}
      />,
    );

    expect(screen.getByText("No downloads available")).toBeInTheDocument();
  });

  it("Renders 'no downloads available' message if there is no downloads", () => {
    render(
      <LessonDownloadsPage
        {...{
          ...props,
          curriculumData: {
            ...props.curriculumData,
            downloads: [],
          },
        }}
      />,
    );

    expect(screen.getByText("No downloads available")).toBeInTheDocument();
  });
  it("Renders 'no downloads available' message if hasDownloadableResources is false", () => {
    render(
      <LessonDownloadsPage
        {...{
          ...props,
          curriculumData: {
            ...props.curriculumData,
            downloads: [],
          },
        }}
      />,
    );

    expect(screen.getByText("No downloads available")).toBeInTheDocument();
  });
  it("Does not render check boxes if hasDownloadableResources is false (copyright material)", () => {
    render(
      <LessonDownloadsPage
        {...{
          ...props,
          curriculumData: {
            ...props.curriculumData,
            downloads: [],
          },
        }}
      />,
    );

    expect(screen.queryByText("Exit quiz questions")).not.toBeInTheDocument();
  });

  describe("download form", () => {
    it("Renders download form with correct elements", () => {
      render(<LessonDownloadsPage {...props} />);

      expect(screen.getAllByRole("heading", { level: 2 })[0]).toHaveTextContent(
        "Lesson resources",
      );
      expect(screen.getAllByRole("heading", { level: 2 })[1]).toHaveTextContent(
        "Your details",
      );

      expect(
        screen.getByPlaceholderText("Enter email address here"),
      ).toBeInTheDocument();

      // Privacy policy link
      const privacyPolicyLink = screen.getByRole("link", {
        name: "Privacy policy (opens in a new tab)",
      });
      expect(privacyPolicyLink).toBeInTheDocument();
      expect(privacyPolicyLink).toHaveAttribute(
        "href",
        "/legal/privacy-policy",
      );
      expect(privacyPolicyLink).toHaveAttribute("target", "_blank");

      // Terms and conditions checkbox
      expect(
        screen.getByLabelText("I accept terms and conditions (required)"),
      ).toBeInTheDocument();

      // Terms and conditions link
      const tcsLink = screen.getByRole("link", {
        name: "Terms & conditions",
      });
      expect(tcsLink).toBeInTheDocument();
      expect(tcsLink).toHaveAttribute("href", "/legal/terms-and-conditions");

      // Lesson resources to download
      const lessonResourcesToDownload = screen.getAllByTestId("resourceCard");
      expect(lessonResourcesToDownload.length).toEqual(2);
      const exitQuizQuestions = screen.getByLabelText("Exit quiz questions");

      expect(exitQuizQuestions).toBeInTheDocument();
      expect(exitQuizQuestions).toHaveAttribute("name", "resources");
      expect(exitQuizQuestions).toHaveAttribute("value", "exit-quiz-questions");

      // Download button
      const downloadButton = screen.getByText("Download .zip");
      expect(downloadButton).toBeInTheDocument();
    });

    it("should display error hint on blur email if not formatted correctly", async () => {
      const { getByPlaceholderText } = render(
        <LessonDownloadsPage {...props} />,
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
        <LessonDownloadsPage {...props} />,
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
    it("should select all resources if user checks 'Select all'", async () => {
      const { getByRole } = render(<LessonDownloadsPage {...props} />);

      const selectAllCheckbox = getByRole("checkbox", { name: "Select all" });
      expect(selectAllCheckbox).toBeChecked();

      const exitQuizQuestions = screen.getByLabelText("Exit quiz questions");
      const exitQuizAnswers = screen.getByLabelText("Exit quiz answers");

      expect(exitQuizQuestions).toBeChecked();
      expect(exitQuizAnswers).toBeChecked();
    });

    it("should deselect all resources if user deselects 'Select all'", async () => {
      const { getByRole } = render(<LessonDownloadsPage {...props} />);

      const selectAllCheckbox = getByRole("checkbox", { name: "Select all" });
      const user = userEvent.setup();
      await user.click(selectAllCheckbox);

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

      expect(getByText("test@test.com")).toBeInTheDocument();
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

      expect(getByText("Primary School")).toBeInTheDocument();
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
        <LessonDownloadsPage {...props} />,
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

      const { getByText, getByTestId, getByDisplayValue } = render(
        <LessonDownloadsPage {...props} />,
      );

      // user click Edit button
      const editButton = getByText("Edit");
      const user = userEvent.setup();
      await user.click(editButton);

      const emailAddress = result.current.emailFromLocalStorage;
      expect(getByTestId("rotated-input-label")).toBeInTheDocument();
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
        <LessonDownloadsPage {...props} />,
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

  describe("Copyright notice", () => {
    it("renders pre-ALB copyright notice on legacy lessons", async () => {
      render(
        <LessonDownloadsPage curriculumData={lessonDownloadsFixtures()} />,
      );

      const copyrightNotice = await screen.findByText(
        "This content is made available by Oak National Academy Limited and its partners",
        { exact: false },
      );

      expect(copyrightNotice).toBeInTheDocument();
    });

    it("renders post-ALB copyright notice on non legacy lessons", async () => {
      render(
        <LessonDownloadsPage curriculumData={lessonDownloadsFixtures2023()} />,
      );

      const copyrightNotice = await screen.findByText(
        "This content is © Oak National Academy Limited (2023), licensed on",
        { exact: false },
      );

      expect(copyrightNotice).toBeInTheDocument();
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
        description:
          "Select and download free lesson resources, including slide decks, worksheets and quizzes",
        ogTitle:
          "Lesson Download: Islamic Geometry | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription:
          "Select and download free lesson resources, including slide decks, worksheets and quizzes",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical:
          "NEXT_PUBLIC_SEO_APP_URL/teachers/programmes/maths-higher-ks4-l/units/geometry/lessons/macbeth-lesson-1",
        robots: "index,follow",
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should not generate pages at build time", async () => {
      const res = await getStaticPaths();

      expect(res).toEqual({
        fallback: "blocking",
        paths: [],
      });
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getStaticProps({
        params: {
          lessonSlug: "macbeth-lesson-1",
          programmeSlug: "math-higher-ks4-l",
          unitSlug: "shakespeare",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: LessonDownloadsPageProps;
      };

      expect(propsResult.props.curriculumData.lessonSlug).toEqual(
        "macbeth-lesson-1",
      );
    });
    it("should throw error", async () => {
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError("No context.params");
    });
  });
});
