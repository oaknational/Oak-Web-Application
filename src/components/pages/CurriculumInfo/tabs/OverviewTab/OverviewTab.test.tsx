import OverviewTab from "./OverviewTab";

import curriculumOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Component - Overview Tab", () => {
  test("user can see the correct number of subject principles", async () => {
    const { getAllByTestId } = renderWithTheme(
      <OverviewTab {...curriculumOverviewFixture()} />
    );
    const subjectPrinciples = await getAllByTestId("subjectPrinciples");
    expect(subjectPrinciples).toHaveLength(
      curriculumOverviewFixture().subjectPrinciples.length
    );
  });
});
