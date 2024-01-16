import DownloadsTab from "./DownloadsTab";

import curriculumDownloadsFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumDownloads.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Component - Download Tab", () => {
  test("user can see see the heading", async () => {
    const { getByTestId } = renderWithTheme(
      <DownloadsTab data={curriculumDownloadsFixture()} />,
    );
    expect(getByTestId("downloads-heading")).toBeInTheDocument;
  });
});
