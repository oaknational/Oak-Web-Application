import { GetStaticPropsContext, PreviewData } from "next";
import { MockOakConsentClient } from "@oaknational/oak-consent-client";
import { omit } from "lodash";

import LessonOverviewCanonicalPage, {
  URLParams,
  getStaticProps,
} from "@/pages/teachers/lessons/[lessonSlug]";
import renderWithProviders, {
  allProviders,
} from "@/__tests__/__helpers__/renderWithProviders";
import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import curriculumApi2023, {
  CurriculumApi,
} from "@/node-lib/curriculum-api-2023";
import OakError from "@/errors/OakError";
import { LessonOverviewCanonical } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import { useShareExperiment } from "@/pages-helpers/teacher/share-experiments/useShareExperiment";
import { useTeacherNotes } from "@/pages-helpers/teacher/share-experiments/useTeacherNotes";

const url = "";

// mock useShareExperiment
jest.mock(
  "@/pages-helpers/teacher/share-experiments/useShareExperiment",
  () => {
    return {
      __esModule: true,
      useShareExperiment: jest.fn(() => ({
        shareExperimentFlag: false,
        shareUrl: "",
        browserUrl: url,
        shareActivated: false,
        shareIdRef: { current: "" },
        shareIdKeyRef: { current: "" },
      })),
    };
  },
);

jest.mock("@/pages-helpers/teacher/share-experiments/useTeacherNotes", () => {
  return {
    __esModule: true,
    useTeacherNotes: jest.fn(() => ({
      teacherNote: {},
      isEditable: false,
      saveTeacherNote: jest.fn(),
      noteSaved: false,
      error: undefined,
    })),
  };
});

jest.mock("posthog-js/react", () => {
  return {
    __esModule: true,
    useFeatureFlagEnabled: jest.fn(() => false),
    useFeatureFlagVariantKey: jest.fn(() => false),
  };
});

const mockCookieConsent = new MockOakConsentClient({
  policyConsents: [
    {
      policyId: "test-policy",
      policySlug: "test-policy-slug",
      consentState: "granted",
      isStrictlyNecessary: false,
      policyLabel: "Test Policy",
      policyDescription: "Test Policy Description",
      consentedToPreviousVersion: false,
      policyParties: [],
    },
  ],
  requiresInteraction: false,
});

const render = renderWithProviders({
  ...omit(allProviders, "cookieConsent"),
  cookieConsent: { client: mockCookieConsent },
});

const lesson = lessonOverviewFixture({
  lessonTitle: "The meaning of time",
});

describe("Lesson Overview Canonical Page", () => {
  beforeAll(() => {
    console.error = jest.fn();
  });

  describe("LessonOverviewCanonicalPage", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Renders title from the props", async () => {
      const result = render(
        <LessonOverviewCanonicalPage
          lesson={{ ...lesson, pathways: [] }}
          isSpecialist={false}
        />,
      );

      expect(result.getByRole("heading", { level: 1 })).toHaveTextContent(
        lesson.lessonTitle,
      );
    });
    it("Renders the lesson overview when no lessonReleaseDate", async () => {
      const result = render(
        <LessonOverviewCanonicalPage
          lesson={{ ...lesson, lessonReleaseDate: null, pathways: [] }}
          isSpecialist={false}
        />,
      );

      expect(result.getByRole("heading", { level: 1 })).toHaveTextContent(
        lesson.lessonTitle,
      );
    });

    it("updates the url", async () => {
      window.history.replaceState = jest.fn();

      (useShareExperiment as jest.Mock).mockReturnValueOnce({
        shareUrl: "http://localhost:3000/teachers/lessons/lesson-1?test=1",
        browserUrl: "http://localhost:3000/teachers/lessons/lesson-1?test=1",
        shareActivated: false,
        shareIdRef: { current: "" },
        shareIdKeyRef: { current: "" },
      });
      render(
        <LessonOverviewCanonicalPage
          lesson={{ ...lesson, pathways: [] }}
          isSpecialist={false}
        />,
      );

      expect(window.history.replaceState).toHaveBeenCalledWith(
        {},
        "",
        "http://localhost:3000/teachers/lessons/lesson-1?test=1",
      );
    });

    it("renders the add teacher note button if cookies are accepted", () => {
      (useTeacherNotes as jest.Mock).mockReturnValue({
        teacherNote: {},
        isEditable: true,
        saveTeacherNote: jest.fn(),
        noteSaved: false,
        error: undefined,
      });

      const { getAllByText } = render(
        <LessonOverviewCanonicalPage
          lesson={{ ...lesson, pathways: [] }}
          isSpecialist={false}
        />,
      );
      expect(getAllByText("Add teacher note and share")).toHaveLength(2);
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      (
        curriculumApi2023.specialistLessonOverviewCanonical as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );

      const propsResult = (await getStaticProps({
        params: {
          lessonSlug:
            "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: { lesson: LessonOverviewCanonical; isSpecialist: false };
      };

      expect(propsResult.props.lesson.lessonSlug).toEqual(
        "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
      );
    });
    it("should throw error if no context params", async () => {
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError("No context.params");
    });
    it("should throw an error if both API's are not found", async () => {
      (curriculumApi2023.lessonOverview as jest.Mock).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError();
    });
    it("should return a redirect if no lesson is found", async () => {
      if (!curriculumApi2023.canonicalLessonRedirectQuery) {
        (curriculumApi2023 as CurriculumApi).canonicalLessonRedirectQuery =
          jest.fn();
      }

      (
        curriculumApi2023.specialistLessonOverviewCanonical as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );

      (curriculumApi2023.lessonOverview as jest.Mock).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      (
        curriculumApi2023.canonicalLessonRedirectQuery as jest.Mock
      ).mockResolvedValueOnce({
        canonicalLessonRedirectData: {
          incomingPath: "lessons/old-lesson-slug",
          outgoingPath: "lessons/new-lesson-slug",
          redirectType: 301 as const, // true = 308, false = 307
        },
      });

      // Call getStaticProps with a test lesson slug
      const result = await getStaticProps({
        params: {
          lessonSlug: "old-lesson-slug",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>);

      // Verify the redirect properties
      expect(result).toHaveProperty("redirect");
      expect(
        (
          result as {
            redirect: {
              destination: string;
              permanent: boolean;
              basePath: boolean;
            };
          }
        ).redirect,
      ).toEqual({
        destination: "lessons/new-lesson-slug?redirected=true",
        statusCode: 301, // true = 308, false = 307
        basePath: false,
      });

      // Verify the redirect API was called with the correct parameters
      expect(
        curriculumApi2023.canonicalLessonRedirectQuery,
      ).toHaveBeenCalledWith({
        incomingPath: "/teachers/lessons/old-lesson-slug",
      });
    });
    it("should return not found if lesson is not found and no redirect found", async () => {
      if (!curriculumApi2023.canonicalLessonRedirectQuery) {
        (curriculumApi2023 as CurriculumApi).canonicalLessonRedirectQuery =
          jest.fn();
      }
      (
        curriculumApi2023.specialistLessonOverviewCanonical as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      (curriculumApi2023.lessonOverview as jest.Mock).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      (
        curriculumApi2023.canonicalLessonRedirectQuery as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );

      const result = await getStaticProps({
        params: {
          lessonSlug: "macbeth-lesson-1",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>);

      expect((result as { notFound: boolean }).notFound).toBe(true);
    });
    it('should throw an error if 2023 api throws an error that is not "curriculum-api/not-found"', async () => {
      (curriculumApi2023.lessonOverview as jest.Mock).mockRejectedValueOnce(
        new Error("Some error"),
      );

      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError();
    });
  });
});
