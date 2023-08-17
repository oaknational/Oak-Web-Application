import { useRouter } from "next/router";

import CurriculumInfoPage, {
  CurriculumInfoPageProps,
  getStaticProps,
  getStaticPaths,
} from "@/pages/beta/[viewType]/curriculum/[subjectPhaseSlug]/[tab]";
import curriculumOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import subjectPhaseOptions from "@/browser-lib/fixtures/subjectPhaseOptions";
import curriculumDownloadsFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumDownloads.fixture";
import curriculumUnitsFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumUnits.fixture";

const render = renderWithProviders();
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("curriculum info page", () => {
  describe("components rendering on page", () => {
    it("renders overview headings", async () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: {
          viewType: "teachers",
          subjectPhaseSlug: "maths-secondary",
          tab: "overview",
        },
        pathname: "/beta/[viewType]/curriculum/[subjectPhaseSlug]/[tab]",
        asPath: `/beta/yourViewType/curriculum/yourSubjectPhaseSlug/overview`,
      });

      const { queryByTestId } = render(
        <CurriculumInfoPage
          subject={{ title: "Maths", slug: "maths" }}
          phase={{ title: "Secondary", slug: "secondary" }}
          overviewTabData={curriculumOverviewFixture()}
          unitsTabData={curriculumUnitsFixture()}
          downloadsTabData={curriculumDownloadsFixture()}
          subjectPhaseOptions={subjectPhaseOptions}
        />
      );
      expect(queryByTestId("curriculum-info")).toBeInTheDocument();
    });
  });

  describe("getStaticProps", () => {
    it("should fail if no props specified", async () => {
      await expect(async () => {
        await getStaticProps({});
      }).rejects.toThrow("Missing params");
    });
    it("should fail if no tab specified", async () => {
      await expect(async () => {
        await getStaticProps({
          params: {
            subjectPhaseSlug: "maths-secondary",
            tab: "not-real-tab",
          },
        });
      }).rejects.toThrow("Invalid tab");
    });
    it("Should provide the expected data", async () => {
      const testRes = (await getStaticProps({
        params: {
          subjectPhaseSlug: "maths-secondary",
          tab: "overview",
        },
      })) as {
        props: CurriculumInfoPageProps;
      };
      expect(testRes.props.subjectPhaseOptions).toEqual(subjectPhaseOptions);
    });
  });

  describe("getStaticPaths", () => {
    it("Should return expected data", async () => {
      const paths = await getStaticPaths();
      expect(paths).toEqual({ fallback: "blocking", paths: [] });
    });
  });
});
