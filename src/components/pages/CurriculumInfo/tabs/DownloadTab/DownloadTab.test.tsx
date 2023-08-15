import DownloadTab from "./DownloadTab";

import curriculumOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Component - Download Tab", () => {
  test("user can see see the heading", async () => {
    const { getByTestId } = renderWithTheme(
      <DownloadTab {...curriculumOverviewFixture} slug="maths-secondary" />
    );
    expect(getByTestId("heading")).toBeInTheDocument;
  });
});
