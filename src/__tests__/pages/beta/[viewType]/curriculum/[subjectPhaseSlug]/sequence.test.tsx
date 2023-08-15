import CurriculumSequencePage, {
  CurriculumSequencePageProps,
  getStaticProps,
  getStaticPaths,
} from "@/pages/beta/[viewType]/curriculum/[subjectPhaseSlug]/sequence";
import curriculumOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import subjectPhaseOptions from "@/browser-lib/fixtures/subjectPhaseOptions";
const render = renderWithProviders();

describe("curriculum sequence page", () => {
  describe("components rendering on page", () => {
    it("renders the unit cards", () => {
      const { queryByTestId } = render(
        <CurriculumSequencePage
          data={curriculumOverviewFixture()}
          subjectPhaseOptions={subjectPhaseOptions}
        />
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
    it("Should provide the expected data", async () => {
      const testRes = (await getStaticProps({
        params: { viewType: "teachers", subjectPhaseSlug: "maths-secondary" },
      })) as {
        props: CurriculumSequencePageProps;
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
