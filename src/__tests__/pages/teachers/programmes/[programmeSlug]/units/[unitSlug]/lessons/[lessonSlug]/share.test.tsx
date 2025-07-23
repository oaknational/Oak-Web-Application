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
import LessonSharePage, {
  LessonSharePageProps,
  URLParams,
  getStaticPaths,
  getStaticProps,
} from "@/pages/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/share";
import lessonShareFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonShare.fixture";
import curriculumApi from "@/node-lib/curriculum-api-2023/__mocks__";

const props: LessonSharePageProps = {
  curriculumData: lessonShareFixtures(),
};

jest.mock("next/dist/client/router", () => require("next-router-mock"));

jest.mock(
  "@/components/TeacherComponents/hooks/downloadAndShareHooks/useLessonDownloadExistenceCheck",
  () => {
    return jest.fn();
  },
);

const lessonShared = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      lessonShared: (...args: unknown[]) => lessonShared(...args),
    },
  }),
}));

jest.mock(
  "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit",
  () => ({
    useHubspotSubmit: () => ({
      onHubspotSubmit: () => {
        return Promise.resolve(true);
      },
    }),
  }),
);

beforeEach(() => {
  renderHook(() => useForm());
  localStorage.clear();
});
const render = renderWithProviders();

describe("pages/teachers/lessons/[lessonSlug]/share", () => {
  it("Renders 'no shared resources available' message if there are no resources to share", () => {
    render(
      <LessonSharePage
        {...{
          ...props,
          curriculumData: {
            ...props.curriculumData,
            shareableResources: [],
          },
        }}
      />,
    );

    expect(screen.getByText("No resources to share")).toBeInTheDocument();
  });
  it("tracks lesson share clicks", async () => {
    const { result } = renderHook(() => useLocalStorageForDownloads());

    act(() => {
      result.current.setEmailInLocalStorage("test@test.com");
      result.current.setTermsInLocalStorage(true);
      result.current.setSchoolInLocalStorage({
        schoolId: "123456-Secondary school",
        schoolName: "Secondary school",
      });
    });

    render(<LessonSharePage {...props} />);
    const shareButtonCopy = await screen.findByRole("link", {
      name: "Share to Email",
    });
    expect(shareButtonCopy).not.toBeDisabled();
    const user = userEvent.setup();
    await user.click(shareButtonCopy);

    expect(lessonShared).toHaveBeenCalledWith({
      lessonName: "Islamic Geometry",
      lessonSlug: "macbeth-lesson-1",
      schoolUrn: "123456",
      schoolName: "Secondary school",
      schoolOption: "Selected school",
      shareMedium: "email",
      emailSupplied: true,
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "advocate",
      componentType: "share_button",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      resourceTypes: ["starter-quiz", "video", "exit-quiz"],
      audience: "Pupil",
      lessonReleaseCohort: "2020-2023",
      lessonReleaseDate: "2025-09-29T14:00:00.000Z",
    });
  });

  describe("Share form", () => {
    it("Renders share form with correct elements", () => {
      render(<LessonSharePage {...props} />);

      expect(screen.getAllByRole("heading", { level: 2 })[0]).toHaveTextContent(
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

      // Lesson resources to share
      const lessonResourcesToShare = screen.getAllByTestId("resourceCard");
      expect(lessonResourcesToShare.length).toEqual(
        props.curriculumData.shareableResources.length,
      );

      const exitQuizQuestions = screen.getByText("Exit quiz");
      expect(exitQuizQuestions).toBeInTheDocument();

      // Temporary disabled until work is complete on pupil side
      // const exitQuizQuestions = screen.getByLabelText("Exit quiz");
      // expect(exitQuizQuestions).toBeInTheDocument();
      // expect(exitQuizQuestions).toHaveAttribute("name", "resources");
      // expect(exitQuizQuestions).toHaveAttribute("value", "exit-quiz-questions");

      // Share buttons
      const shareButtonCopy = screen.getByRole("button", {
        name: "Copy link to clipboard",
      });
      expect(shareButtonCopy).toBeInTheDocument();
      const shareButtonGoogle = screen.getByRole("link", {
        name: "Share to Google Classroom",
      });
      expect(shareButtonGoogle).toBeInTheDocument();
      const shareButtonMicrosoft = screen.getByRole("link", {
        name: "Share to Microsoft Teams",
      });
      expect(shareButtonMicrosoft).toBeInTheDocument();
      const shareButtonEmail = screen.getByRole("link", {
        name: "Share to Email",
      });
      expect(shareButtonEmail).toBeInTheDocument();
    });

    it("should display error hint on blur email if not formatted correctly", async () => {
      const { getByPlaceholderText } = render(<LessonSharePage {...props} />);

      const input = getByPlaceholderText("Enter email address here");
      const user = userEvent.setup();
      await user.click(input);
      await user.keyboard("not an email");
      await user.tab();

      // HACK: wait for next tick
      await waitForNextTick();

      const description = computeAccessibleDescription(input);
      expect(description).toBe("Error Please enter a valid email address");
    });

    it("should not display error hint on blur email if empty", async () => {
      const { getByPlaceholderText } = render(<LessonSharePage {...props} />);

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

  describe("renders details saved in local storage", () => {
    it("renders DetailsCompleted component with email filled from local storage if available", async () => {
      const { result } = renderHook(() => useLocalStorageForDownloads());

      act(() => {
        result.current.setEmailInLocalStorage("test@test.com");
        result.current.setTermsInLocalStorage(true);
      });

      const { getByText } = render(<LessonSharePage {...props} />);

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

      const { getByText } = render(<LessonSharePage {...props} />);

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
        <LessonSharePage {...props} />,
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
        <LessonSharePage {...props} />,
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

      const { getByText, getByTestId } = render(<LessonSharePage {...props} />);

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
        <LessonSharePage
          curriculumData={lessonShareFixtures({ isLegacy: true })}
        />,
      );

      const copyrightNotice = await screen.findByText(
        "This content is made available by Oak National Academy Limited and its partners",
        { exact: false },
      );

      expect(copyrightNotice).toBeInTheDocument();
    });
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo()(<LessonSharePage {...props} />);

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Lesson Share: Islamic Geometry | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
        description:
          "Share online lesson activities with your students, such as videos, worksheets and quizzes.",
        ogTitle:
          "Lesson Share: Islamic Geometry | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription:
          "Share online lesson activities with your students, such as videos, worksheets and quizzes.",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
        canonical:
          "NEXT_PUBLIC_SEO_APP_URL/teachers/programmes/maths-higher-ks4-l/units/geometry/lessons/macbeth-lesson-1",
        robots: "noindex,nofollow",
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
        props: LessonSharePageProps;
      };

      expect(propsResult.props.curriculumData.lessonSlug).toEqual(
        "macbeth-lesson-1",
      );
    });
    it("Should call curriculum api with correct props", async () => {
      await getStaticProps({
        params: {
          programmeSlug: "maths-secondary-ks4-higher-l",
          unitSlug: "maths-secondary-ks4-higher-l",
          lessonSlug: "adding-surds-a57d",
        },
      });
      expect(curriculumApi.lessonShare).toHaveBeenCalledWith({
        programmeSlug: "maths-secondary-ks4-higher-l",
        unitSlug: "maths-secondary-ks4-higher-l",
        lessonSlug: "adding-surds-a57d",
      });
    });
    it("should return notFound when a landing page is missing", async () => {
      (curriculumApi.lessonShare as jest.Mock).mockResolvedValueOnce(undefined);

      const context = {
        params: {
          programmeSlug: "maths-secondary-ks4-higher-l",
          unitSlug: "maths-secondary-ks4-higher-l",
          lessonSlug: "adding-surds-a57d",
        },
      };
      const response = await getStaticProps(context);
      expect(response).toEqual({
        notFound: true,
      });
    });
    it("should throw error", async () => {
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError("No context.params");
    });
  });
});
