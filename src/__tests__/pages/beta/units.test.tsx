import { screen, waitFor } from "@testing-library/react";

import SubjectUnitsListPage, {
  SubjectUnitsListPageProps,
} from "../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectUnitsSlug]/units";
import { mockSeoResult } from "../../__helpers__/cms";
import renderWithProviders from "../../__helpers__/renderWithProviders";
import renderWithSeo from "../../__helpers__/renderWithSeo";

const unitPageData = {
  subjectTitle: "Art and design",
  subjectSlug: "art-and-design",
  keyStageTitle: "Key stage 4",
  keyStageSlug: "4",
  availableTiers: [],
  units: [
    {
      title:
        "1, To build knowledge of the historical context of the play ‘Macbeth’",
      slug: "To-build-knowledge",
      learningThemeTitle: "MacBeth",
      lessonCount: 4,
      hasUnitQuiz: false,
      subjectSlug: "english",
      keyStageSlug: "4",
    },
    {
      title:
        "1, To build knowledge of the historical context of the play ‘Macbeth’",
      slug: "To-build-knowledge-2",
      learningThemeTitle: "MacBeth",
      lessonCount: 4,
      hasUnitQuiz: false,
      subjectSlug: "english",
      keyStageSlug: "4",
    },
  ],
};

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("pages/teachers/key-stages/[keyStageSlug]/subjects/[subjectUnitsSlug]/units.tsx", () => {
  it("Renders title from props ", () => {
    renderWithProviders(<SubjectUnitsListPage pageData={unitPageData} />);

    waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Art and design"
      );
    });
  });

  describe.skip("SEO", () => {
    it("renders the correct SEO details", () => {
      const { seo } = renderWithSeo(
        <SubjectUnitsListPage pageData={unitPageData} />
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
        "../../../pages/beta/teachers//key-stages/[keyStageSlug]/subjects/[subjectUnitsSlug]/units"
      );

      const pathsResult = await getStaticPaths({});

      expect(pathsResult.paths).toEqual([
        { params: { keyStageSlug: "4", subjectUnitsSlug: "art-and-design" } },
        { params: { keyStageSlug: "4", subjectUnitsSlug: "maths" } },
      ]);
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const { getStaticProps } = await import(
        "../../../pages/beta/teachers//key-stages/[keyStageSlug]/subjects/[subjectUnitsSlug]/units"
      );
      const propsResult = (await getStaticProps({
        params: { subjectUnitsSlug: "art-and-design" },
      })) as {
        props: SubjectUnitsListPageProps;
      };

      expect(propsResult.props.pageData.subjectSlug).toEqual("art-and-design");
    });
  });
});
