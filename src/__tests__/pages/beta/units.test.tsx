import { screen, waitFor } from "@testing-library/react";

import SubjectUnitsListPage, {
  SubjectUnitsListPageProps,
} from "../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/units";
import { mockSeoResult } from "../../__helpers__/cms";
import renderWithProviders from "../../__helpers__/renderWithProviders";
import renderWithSeo from "../../__helpers__/renderWithSeo";

const unitPageData = {
  subjectTitle: "Art and design",
  subjectSlug: "art-and-design",
  keyStageTitle: "Key stage 4",
  keyStageSlug: "ks4",
  availableTiers: [],
  units: [
    {
      title:
        "1, To build knowledge of the historical context of the play ‘Macbeth’",
      slug: "To-build-knowledge",
      themeTitle: "MacBeth",
      lessonCount: 4,
      hasUnitQuiz: false,
      subjectSlug: "english",
      keyStageSlug: "ks4",
    },
    {
      title:
        "1, To build knowledge of the historical context of the play ‘Macbeth’",
      slug: "To-build-knowledge-2",
      themeTitle: "MacBeth",
      lessonCount: 4,
      hasUnitQuiz: false,
      subjectSlug: "english",
      keyStageSlug: "ks4",
    },
  ],
};

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("pages/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/units.tsx", () => {
  it("Renders title from props ", () => {
    renderWithProviders(<SubjectUnitsListPage curriculumData={unitPageData} />);

    waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Art and design"
      );
    });
  });

  describe("SEO", () => {
    it("renders the correct SEO details", () => {
      const { seo } = renderWithSeo(
        <SubjectUnitsListPage curriculumData={unitPageData} />
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Units | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Subject units",
        ogTitle: "Units | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Subject units",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should return the paths of all subjects and keystage", async () => {
      const { getStaticPaths } = await import(
        "../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/units"
      );

      const pathsResult = await getStaticPaths({});

      expect(pathsResult.paths).toHaveLength(76);
      expect(pathsResult.paths[0]).toEqual({
        params: { keyStageSlug: "ks4", subjectSlug: "combined-science" },
      });
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const { getStaticProps } = await import(
        "../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/units"
      );
      const propsResult = (await getStaticProps({
        params: { subjectSlug: "art", keyStageSlug: "ks4" },
      })) as {
        props: SubjectUnitsListPageProps;
      };

      expect(propsResult.props.curriculumData.subjectSlug).toEqual("art");
    });
  });
});
