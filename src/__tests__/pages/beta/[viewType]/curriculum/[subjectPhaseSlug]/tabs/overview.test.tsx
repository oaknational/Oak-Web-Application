import OverviewTab from "@/pages/beta/[viewType]/curriculum/[subjectPhaseSlug]/tabs/overview";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import curriculumOverviewTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
const render = renderWithProviders();

describe("curriculum sequence page", () => {
  describe("components rendering on page", () => {
    it("renders the unit cards", () => {
      const subject = {
        title: "Maths",
        slug: "maths",
      };
      const phase = {
        title: "Primary",
        slug: "primary",
      };
      const { queryByTestId } = render(
        <OverviewTab
          data={curriculumOverviewTabFixture()}
          subject={subject}
          phase={phase}
        />
      );
      expect(queryByTestId("intent-heading")).toBeInTheDocument();
    });
  });
});
