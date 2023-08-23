import OverviewTab from "./OverviewTab";

import curriculumOverviewTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Component - Overview Tab", () => {
  test("user can see the correct number of subject principles", async () => {
    const { getAllByTestId } = renderWithTheme(
      <OverviewTab
        data={curriculumOverviewTabFixture()}
        slug="maths-secondary"
      />
    );
    const subjectPrinciples = await getAllByTestId("subjectPrinciples");
    expect(subjectPrinciples).toHaveLength(
      curriculumOverviewTabFixture().subjectPrinciples.length
    );
  });
});
