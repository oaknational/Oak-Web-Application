import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { useOakPupil } from "@/hooks/useOakPupil";
import CanonicalResultsPage, {
  CanonicalResultsPrintablePageProps,
  getStaticProps,
  InnerRender,
} from "@/pages/pupils/lessons/[lessonSlug]/results/[attemptId]/printable";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import OakError from "@/errors/OakError";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const mockProps: CanonicalResultsPrintablePageProps = {
  browseData: lessonBrowseDataFixture({}),
  content: lessonContentFixture({}),
  attemptId: "attemptId",
};
jest.mock("@/hooks/useOakPupil", () => ({
  ...jest.requireActual("@/hooks/useOakPupil"),
  useOakPupil: jest.fn().mockReturnValue({
    getAttempt: jest.fn(),
  }),
}));

jest.mock("@/components/PupilViews/PupilResults", () => ({
  PupilViewsResults: () => <div>attemptDataRendered</div>,
}));

describe("CanonicalResultsPage", () => {
  it("should render", () => {
    expect(CanonicalResultsPage).toBeTruthy();
  });
  describe("innner render", () => {
    it("should render loading state if no attempt data", () => {
      const { getByText } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <InnerRender {...mockProps} />
        </OakThemeProvider>,
      );
      expect(getByText("Loading lesson results...")).toBeInTheDocument();
    });
    it("should render PupilViewsResults if attempt data", async () => {
      const mockAttemptData = { attemptData: "attemptData" };
      (useOakPupil as jest.Mock).mockReturnValue({
        getAttempt: jest.fn().mockResolvedValue(mockAttemptData),
      });
      renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <InnerRender {...mockProps} />
        </OakThemeProvider>,
      );
      expect(screen.getByText("Loading lesson results...")).toBeInTheDocument();
      await waitFor(() => {
        expect(
          screen.queryByText("Loading lesson results..."),
        ).not.toBeInTheDocument();
        expect(screen.getByText("attemptDataRendered")).toBeInTheDocument();
      });
    });
  });

  // });
  describe("pages/pupils/lessons/[lessonSlug]/results/[attemptId]/printable", () => {
    describe("getStaticProps", () => {
      it("Should call API:pupilLessonQuery", async () => {
        await getStaticProps({
          params: {
            lessonSlug: "lessonSlug",
            attemptId: "attemptId",
          },
        });

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
        };

        (curriculumApi2023.pupilLessonQuery as jest.Mock).mockResolvedValueOnce(
          curriculumData,
        );

        const res = (await getStaticProps({
          params: {
            lessonSlug: "lessonSlug",
            attemptId: "attemptId",
          },
        })) as {
          props: CanonicalResultsPrintablePageProps;
        };

        expect(res.props.browseData).toEqual(curriculumData.browseData);
        expect(res.props.content).toEqual(curriculumData.content);
      });

      it("should return 404 if lesson not found", async () => {
        (curriculumApi2023.pupilLessonQuery as jest.Mock).mockRejectedValueOnce(
          new OakError({ code: "curriculum-api/not-found" }),
        );
        const res = await getStaticProps({
          params: {
            lessonSlug: "lessonSlug",
            attemptId: "attemptId",
          },
        });

        expect(res).toEqual({
          notFound: true,
        });
      });
    });
  });
});
