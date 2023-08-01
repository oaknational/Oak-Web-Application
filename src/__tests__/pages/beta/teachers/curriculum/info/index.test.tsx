import CurriculumInfoPage from "../../../../../../pages/beta/teachers/curriculum/info";
import curriculumOverviewFixture from "../../../../../../node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixtures";
import renderWithProviders from "../../../../../__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("curriculum info page", () => {
  describe("components rendering on page", () => {
    it("renders overview headings", () => {
      const { queryByTestId } = render(
        <CurriculumInfoPage data={curriculumOverviewFixture()} />
      );

      expect(queryByTestId("intent-heading")).toBeInTheDocument();
    });
  });
});
