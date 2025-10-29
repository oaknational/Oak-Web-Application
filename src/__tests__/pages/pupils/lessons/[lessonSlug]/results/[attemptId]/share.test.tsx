import { lessonContentFixture } from "@oaknational/oak-curriculum-schema";
import { GetServerSidePropsContext } from "next";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import CanonicalResultsPage, {
  CanonicalResultsSharePageProps,
  getServerSideProps,
} from "@/pages/pupils/lessons/[lessonSlug]/results/[attemptId]/share";
import keysToCamelCase from "@/utils/snakeCaseConverter";

jest.mock("@/node-lib/pupil-api/network/network", () => ({
  ...jest.requireActual("@/node-lib/pupil-api/network/network"),
  PupilNetworkClient: jest.fn(() => ({
    getAttempt: () => Promise.resolve(mockReturn),
  })),
}));

const mockAttemptData = {
  attempt_id: "ARHMdfK44YeMawb1QtnxN",
  created_at: "2021-09-29T14:00:00Z",
  lesson_data: {
    title: "Test Lesson",
    slug: "test-lesson",
  },
  browse_data: {
    subject: "Test Subject",
    year_description: "Test Year",
  },
  section_results: {
    intro: {
      worksheet_downloaded: false,
      worksheet_available: false,
      is_complete: false,
    },
    "starter-quiz": {
      is_complete: true,
      grade: 3,
      num_questions: 3,
    },
    video: {
      is_complete: false,
    },
    "exit-quiz": {
      is_complete: false,
      grade: 3,
      num_questions: 3,
    },
  },
};

type AttemptData = typeof mockAttemptData;

const mockReturn: Record<string, AttemptData> = {
  ARHMdfK44YeMawb1QtnxN: mockAttemptData,
};

describe("pages/pupils/lessons/[lessonSlug]/results/[attemptId]/share", () => {
  describe("CanonicalResultsPage", () => {
    it("should render", () => {
      expect(CanonicalResultsPage).toBeTruthy();
    });
  });
  describe("getServerSideProps", () => {
    const getContext = (overrides: Partial<GetServerSidePropsContext>) =>
      ({
        req: {},
        res: {},
        query: {},
        params: { lessonSlug: "lessonSlug", attemptId: "attemptId" },
        ...overrides,
      }) as unknown as GetServerSidePropsContext<{
        lessonSlug: string;
        attemptId: string;
      }>;
    it("Should call API:pupilLessonQuery", async () => {
      await getServerSideProps(
        getContext({
          params: {
            lessonSlug: "lessonSlug",
            attemptId: "ARHMdfK44YeMawb1QtnxN",
          },
        }),
      );

      expect(curriculumApi2023.pupilLessonQuery).toHaveBeenCalledWith({
        lessonSlug: "lessonSlug",
      });
    });

    it("should return props", async () => {
      const curriculumData = {
        browseData: lessonBrowseDataFixture({
          isLegacy: true,
          unitSlug: "test-unit-slug",
        }),
        content: lessonContentFixture({}),
        attemptData: mockAttemptData,
      };

      (curriculumApi2023.pupilLessonQuery as jest.Mock).mockResolvedValueOnce(
        curriculumData,
      );

      const res = await getServerSideProps(
        getContext({
          params: {
            lessonSlug: "lessonSlug",
            attemptId: "ARHMdfK44YeMawb1QtnxN",
          },
        }),
      );
      expect((res as { props: CanonicalResultsSharePageProps }).props).toEqual({
        browseData: curriculumData.browseData,
        content: curriculumData.content,
        attemptData: keysToCamelCase(mockAttemptData),
      });
    });
    it("should throw error if lessonSlug or attemptId is missing", async () => {
      await expect(
        getServerSideProps(
          getContext({ params: { lessonSlug: "", attemptId: "" } }),
        ),
      ).rejects.toThrow("unexpected context.params");
    });
    it("should throw error if attemptData is missing", async () => {
      await expect(
        getServerSideProps(
          getContext({
            params: {
              lessonSlug: "lessonSlug",
              attemptId: "ARHMdfK44YeMawb1QtnxNjnjnjn",
            },
          }),
        ),
      ).rejects.toThrow("unexpected attemptData");
    });
  });
});
