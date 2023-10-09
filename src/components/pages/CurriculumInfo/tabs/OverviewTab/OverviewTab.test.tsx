import OverviewTab from "./OverviewTab";

import curriculumOverviewTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Component - Overview Tab", () => {
  test("user can see the correct number of subject principles", async () => {
    const { getAllByTestId } = renderWithTheme(
      <OverviewTab data={curriculumOverviewTabFixture()} />,
    );
    const subjectPrinciples = await getAllByTestId("subject-principles");
    expect(subjectPrinciples).toHaveLength(
      curriculumOverviewTabFixture().curriculumCMSInfo.subjectPrinciples.length,
    );
  });
  test("if there are sub bullets then these should be rendered", async () => {
    const fixture = curriculumOverviewTabFixture();
    fixture.curriculumCMSInfo.subjectPrinciples = [
      "Sequences learning over time which: • Builds musical knowledge, techniques and specialist language • Promotes the understanding of a diverse range of genres, traditions and styles • Develops pupils analytical skills in responding to different types of music",
    ];
    const { getAllByTestId } = renderWithTheme(<OverviewTab data={fixture} />);
    const subjectPrinciples = await getAllByTestId("sp-subbullet");
    expect(subjectPrinciples).toHaveLength(3);
  });
});
