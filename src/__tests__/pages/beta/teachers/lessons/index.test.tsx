import { screen, waitFor } from "@testing-library/react";

import renderWithSeo from "../../../../__helpers__/renderWithSeo";
import LessonOverviewPage from //getServerSideProps,
//getStaticPaths,
// LessonOverviewPageProps,
"../../../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/units/[unitSlug]/lessons/[lessonSlug]";
import { mockSeoResult } from "../../../../__helpers__/cms";
import renderWithProviders from "../../../../__helpers__/renderWithProviders";
import teachersLessonOverviewFixture from "../../../../../node-lib/curriculum-api/fixtures/teachersLessonOverview.fixture";

const props = {
  curriculumData: teachersLessonOverviewFixture({
    videoMuxPlaybackId: "pid-001",
    videoWithSignLanguageMuxPlaybackId: "pid-002",
  }),
};

describe("pages/beta/teachers/lessons", () => {
  it("Renders title from the props", async () => {
    renderWithProviders(<LessonOverviewPage {...props} />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Islamic Geometry"
      );
    });
  });

  it("renders sign language button if there is a sign language video", async () => {
    renderWithProviders(<LessonOverviewPage {...props} />);

    await waitFor(() => {
      expect(screen.getByTestId("sign-language-button")).toHaveTextContent(
        "Signed video"
      );
    });
  });

  it("sign language button toggles on click", async () => {
    renderWithProviders(<LessonOverviewPage {...props} />);

    const signLanguageButton = screen.getByTestId("sign-language-button");
    await signLanguageButton.click();
    expect(screen.getByTestId("sign-language-button")).toHaveTextContent(
      "Unsigned"
    );
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo(<LessonOverviewPage {...props} />);

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
    // });
    // describe("getStaticPaths", () => {
    //   it("Should return the paths of lesson overview", async () => {
    //     const pathsResult = await getStaticPaths({});
    //     expect(pathsResult.paths[0]).toEqual({
    //       params: {
    //         keyStageSlug: "ks4",
    //         subjectSlug: "maths",
    //         unitSlug: "geometry",
    //         lessonSlug: "cirlces-001",
    //       },
    //     });
    //   });
    // });
    // describe("getServerSideProps", () => {
    //   it("Should fetch the correct data", async () => {
    //     const propsResult = (await getServerSideProps({
    //       params: {
    //         lessonSlug: "macbeth-lesson-1",
    //         keyStageSlug: "ks2",
    //         subjectSlug: "english",
    //         unitSlug: "shakespeare",
    //       },
    //     })) as {
    //       props: LessonOverviewPageProps;
    //     };

    //     expect(propsResult.props.curriculumData.slug).toEqual("macbeth-lesson-1");
    //   });
  });
});
