import "@testing-library/jest-dom";

import PupilLessonExitQuizPage, {
  getStaticProps,
} from "@/pages/pupils/lessons/[lessonSlug]/exit-quiz";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";

const getPropsMock = jest.fn();
const buildPageProps = jest.fn();

jest.mock("@/pages-helpers/pupil/lessons-pages/getProps", () => ({
  getProps: (...args: unknown[]) => getPropsMock(...args),
}));

jest.mock("@/node-lib/getPageProps", () => ({
  __esModule: true,
  default: (args: { getProps: () => Promise<unknown> }) => buildPageProps(args),
}));

jest.mock("@/pages-helpers/pupil/lessons-pages/new/QuizPageContent", () => ({
  QuizPageContent: ({ section }: { section: string }) => (
    <div data-testid="quiz-page-content">{section}</div>
  ),
}));

jest.mock("@/components/PupilComponents/PupilLayout/PupilLayout", () => ({
  PupilLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pupil-layout">{children}</div>
  ),
}));

beforeEach(() => {
  getPropsMock.mockReset();
  buildPageProps.mockReset();
});

describe("pages/pupils/lessons/[lessonSlug]/exit-quiz", () => {
  describe("page component", () => {
    it("renders the QuizPageContent inside the PupilLayout", () => {
      const { getByTestId } = renderWithTheme(
        <PupilLessonExitQuizPage
          browseData={lessonBrowseDataFixture({})}
          lessonContent={lessonContentFixture({})}
          backUrl={null}
          hasWorksheet={false}
          worksheetInfo={null}
          hasAdditionalFiles={false}
          additionalFiles={null}
          variant={null}
          initialSection="exit-quiz"
          pageType="canonical"
        />,
      );

      expect(getByTestId("pupil-layout")).toBeInTheDocument();
      expect(getByTestId("quiz-page-content")).toHaveTextContent("exit-quiz");
    });
  });

  describe("getStaticProps", () => {
    it("delegates to getPageProps with an exit-quiz-bound canonical context", async () => {
      buildPageProps.mockResolvedValue({ props: { ok: true } });
      getPropsMock.mockReturnValue("getProps-result");

      const ctx = {
        params: { lessonSlug: "lesson-1" },
      } as never;

      const result = await getStaticProps(ctx);

      expect(getPropsMock).toHaveBeenCalledWith({
        page: "canonical",
        context: expect.objectContaining({
          params: expect.objectContaining({
            lessonSlug: "lesson-1",
            section: "exit-quiz",
          }),
        }),
      });
      expect(buildPageProps).toHaveBeenCalledWith(
        expect.objectContaining({
          page: "pupils-lesson-canonical-exit-quiz::getStaticProps",
          context: ctx,
          getProps: "getProps-result",
        }),
      );
      expect(result).toEqual({ props: { ok: true } });
    });

    it("falls back to undefined params when context.params is missing", async () => {
      buildPageProps.mockResolvedValue({ props: {} });
      getPropsMock.mockReturnValue("getProps-result");

      await getStaticProps({} as never);

      expect(getPropsMock).toHaveBeenCalledWith(
        expect.objectContaining({
          context: expect.objectContaining({ params: undefined }),
        }),
      );
    });
  });
});
