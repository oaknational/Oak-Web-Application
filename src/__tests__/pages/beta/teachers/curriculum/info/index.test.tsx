import CurriculumInfoPage from "../../../../../../pages/beta/[viewType]/curriculum/[subjectPhaseSlug]/[tab]";
import curriculumOverviewFixture from "../../../../../../node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixtures";
import renderWithProviders from "../../../../../__helpers__/renderWithProviders";
import subjectPhaseOptions from "../../../../../../browser-lib/fixtures/subjectPhaseOptions";
const render = renderWithProviders();

describe("curriculum info page", () => {
  describe("components rendering on page", () => {
    it("renders overview headings", () => {
      const { queryByTestId } = render(
        <CurriculumInfoPage
          data={curriculumOverviewFixture()}
          subjectPhaseOptions={subjectPhaseOptions}
          tab="over"
        />
      );

      expect(queryByTestId("intent-heading")).toBeInTheDocument();
    });
  });
});
