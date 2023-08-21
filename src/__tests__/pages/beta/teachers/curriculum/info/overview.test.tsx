import CurriculumInfoPage from "@/pages/beta/[viewType]/curriculum/[subjectPhaseSlug]/overview";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import subjectPhaseOptions from "@/browser-lib/fixtures/subjectPhaseOptions";
import curriculumOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
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
});
