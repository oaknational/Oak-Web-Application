import CurriculumInfoPage, {
  OverviewPageProps,
  getStaticProps,
  getStaticPaths,
} from "@/pages/beta/[viewType]/curriculum/[subjectPhaseSlug]/overview";
import curriculumOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import subjectPhaseOptions from "@/browser-lib/fixtures/subjectPhaseOptions";
const render = renderWithProviders();

describe("curriculum info page", () => {
  describe("components rendering on page", () => {
    it("renders overview headings", () => {
      const { queryByTestId } = render(
        <CurriculumInfoPage
          data={curriculumOverviewFixture()}
          subjectPhaseOptions={subjectPhaseOptions}
        />
      );

      expect(queryByTestId("intent-heading")).toBeInTheDocument();
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
        props: OverviewPageProps;
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
