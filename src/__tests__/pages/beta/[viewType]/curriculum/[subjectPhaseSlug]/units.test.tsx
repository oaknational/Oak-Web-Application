import CurriculumUnitsPage, {
  getStaticProps,
  getStaticPaths,
} from "@/pages/beta/[viewType]/curriculum/[subjectPhaseSlug]/units";
import curriculumUnitsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumUnits.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import subjectPhaseOptions from "@/browser-lib/fixtures/subjectPhaseOptions";
import curriculumHeaderFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumHeader.fixture";

const render = renderWithProviders();

describe("curriculum sequence page", () => {
  describe("components rendering on page", () => {
    it("renders the unit cards", () => {
      const { queryByTestId } = render(
        <CurriculumUnitsPage
          curriculumUnitsData={curriculumUnitsTabFixture()}
          curriculumHeaderData={curriculumHeaderFixture()}
          subjectPhaseOptions={subjectPhaseOptions}
          pageSlug="secondary-maths"
        />,
      );

      expect(queryByTestId("unit-cards")).toBeInTheDocument();
    });
  });

  describe("getStaticProps", () => {
    it("should fail if no props specified", async () => {
      await expect(async () => {
        await getStaticProps({});
      }).rejects.toThrow("Missing params");
    });
  });

  describe("getStaticPaths", () => {
    it("Should return expected data", async () => {
      const paths = await getStaticPaths();
      expect(paths).toEqual({ fallback: "blocking", paths: [] });
    });
  });
});
