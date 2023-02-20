import { screen, waitFor } from "@testing-library/react";
import { GetServerSidePropsContext, PreviewData } from "next";

import teachersKeyStageSubjectTiersFixture from "../../../../../../../node-lib/curriculum-api/fixtures/teachersKeyStageSubjectTiers.fixture";
import teachersKeyStageSubjectUnitsFixture from "../../../../../../../node-lib/curriculum-api/fixtures/teachersKeyStageSubjectUnits.fixture";
import { URLParams } from "../../../../../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]";
import SubjectUnitsListPage, {
  getServerSideProps,
  SubjectUnitsListPageProps,
} from "../../../../../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/units";
// import { mockSeoResult } from "../../../../../../__helpers__/cms";
import renderWithProviders from "../../../../../../__helpers__/renderWithProviders";
// import renderWithSeo from "../../../../../../__helpers__/renderWithSeo";

const curriculumData = teachersKeyStageSubjectUnitsFixture();
const tieredCurriculumData = teachersKeyStageSubjectTiersFixture();

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("pages/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/units.tsx", () => {
  it("Renders title from props ", () => {
    renderWithProviders(
      <SubjectUnitsListPage
        tieredCurriculumData={tieredCurriculumData}
        curriculumData={curriculumData}
        learningThemeSlug={null}
      />
    );

    waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Art and design"
      );
    });
  });

  // describe("SEO", () => {
  //   it("renders the correct SEO details", () => {
  //     const { seo } = renderWithSeo(
  //       <SubjectUnitsListPage
  //         tieredCurriculumData={tieredCurriculumData}
  //         curriculumData={curriculumData}
  //         learningThemeSlug={null}
  //       />
  //     );

  //     expect(seo).toEqual({
  //       ...mockSeoResult,
  //       ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
  //       title: "Units | NEXT_PUBLIC_SEO_APP_NAME",
  //       description: "Subject units",
  //       ogTitle: "Units | NEXT_PUBLIC_SEO_APP_NAME",
  //       ogDescription: "Subject units",
  //       ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
  //       canonical: "NEXT_PUBLIC_SEO_APP_URL",
  //     });
  //   });
  // });

  describe("getServerSideProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getServerSideProps({
        params: {
          subjectSlug: "art",
          keyStageSlug: "ks4",
        },
        query: {},
      } as GetServerSidePropsContext<URLParams, PreviewData>)) as {
        props: SubjectUnitsListPageProps;
      };

      expect(propsResult.props.curriculumData).toEqual(
        teachersKeyStageSubjectUnitsFixture()
      );
    });
  });
});
