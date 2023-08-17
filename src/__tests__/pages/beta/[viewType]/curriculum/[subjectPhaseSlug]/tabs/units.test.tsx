import UnitsTab from "@/pages/beta/[viewType]/curriculum/[subjectPhaseSlug]/tabs/units";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import curriculumUnitsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumUnits.fixture";
const render = renderWithProviders();

describe("curriculum sequence page", () => {
  describe("components rendering on page", () => {
    it("renders the unit cards", () => {
      const data = curriculumUnitsTabFixture;
      const subject = {
        title: "Maths",
        slug: "maths",
      };
      const phase = {
        title: "Primary",
        slug: "primary",
      };
      const { queryByTestId } = render(
        <UnitsTab data={data()} subject={subject} phase={phase} />
      );
      expect(queryByTestId("unit-cards")).toBeInTheDocument();
    });
  });
});
