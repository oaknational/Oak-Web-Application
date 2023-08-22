import DownloadTab from "./DownloadTab";

import curriculumDownloadsFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumDownload.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Component - Download Tab", () => {
  test("user can see see the heading", async () => {
    const { getByTestId } = renderWithTheme(
      <DownloadTab data={curriculumDownloadsFixture()} slug="maths-secondary" />
    );
    expect(getByTestId("heading")).toBeInTheDocument;
  });
});
