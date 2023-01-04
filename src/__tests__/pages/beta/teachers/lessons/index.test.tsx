import { screen } from "@testing-library/react";

import renderWithSeo from "../../../../__helpers__/renderWithSeo";
import LessonOverviewPage, {
  getStaticProps,
  getStaticPaths,
  LessonOverviewPageProps,
} from "../../../../../pages/beta/teachers/lessons/[lessonSlug]";
import { mockSeoResult } from "../../../../__helpers__/cms";
import renderWithProviders from "../../../../__helpers__/renderWithProviders";

const testCurriculumData = {
  curriculumData: {
    keyStageSlug: "ks1",
    keyStageTitle: "Key stage 1",
    lessonTitle: "macbeth lesson 1",
    lessonSlug: "macbeth-lesson-1",
    coreContent: ["string"],
    subjectTitle: "string",
    subjectSlug: "string",
    equipmentRequired: "string",
    supervisionLevel: "string",
    contentGuidance: "string",
    video: "string",
    signLanguageVideo: "string",
    presentation: "string",
    worksheet: "string",
  },
};

describe("pages/beta/teachers/lessons", () => {
  it("Renders title from the props", async () => {
    renderWithProviders(<LessonOverviewPage {...testCurriculumData} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "macbeth lesson 1"
    );
  });

  it("renders sign language button if there is a sign language video", async () => {
    renderWithProviders(<LessonOverviewPage {...testCurriculumData} />);

    expect(screen.getByTestId("sign-language-button")).toHaveTextContent(
      "Signed video"
    );
  });

  it("sign language button toggles on click", async () => {
    renderWithProviders(<LessonOverviewPage {...testCurriculumData} />);

    const signLanguageButton = screen.getByTestId("sign-language-button");
    await signLanguageButton.click();
    expect(screen.getByTestId("sign-language-button")).toHaveTextContent(
      "Unsigned"
    );
  });

  it("renders an iframe for a presentation and worksheet", async () => {
    const { getAllByRole } = renderWithProviders(
      <LessonOverviewPage {...testCurriculumData} />
    );
    const iframeElement = getAllByRole("iframe");
    expect(iframeElement.length).toEqual(2);
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo(
        <LessonOverviewPage {...testCurriculumData} />
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Lesson overview | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Overview of lesson",
        ogTitle: "Lesson overview | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Overview of lesson",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
      });
    });
  });
  describe("getStaticPaths", () => {
    it("Should return the paths of lesson overview", async () => {
      const pathsResult = await getStaticPaths({});
      expect(pathsResult.paths[0]).toEqual({
        params: { lessonSlug: "macbeth-lesson-1" },
      });
    });
  });
  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getStaticProps({
        params: { lessonSlug: "macbeth-lesson-1" },
      })) as {
        props: LessonOverviewPageProps;
      };

      expect(propsResult.props.curriculumData.lessonSlug).toEqual(
        "macbeth-lesson-1"
      );
    });
  });
});
