import DownloadPage, {
  getStaticProps,
  getStaticPaths,
} from "@/pages/beta/[viewType]/curriculum/[subjectPhaseSlug]/downloads";
import curriculumDownloadTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumDownload.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import subjectPhaseOptions from "@/browser-lib/fixtures/subjectPhaseOptions";
import curriculumHeaderFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumHeader.fixture";
const render = renderWithProviders();

describe("curriculum download page", () => {
  describe("components rendering on page", () => {
    it("renders overview headings", () => {
      const { queryByTestId } = render(
        <DownloadPage
          downloadsData={curriculumDownloadTabFixture()}
          curriculumHeaderData={curriculumHeaderFixture()}
          subjectPhaseOptions={subjectPhaseOptions}
          subjectPhaseSlug="maths-secondary"
        />,
      );

      expect(queryByTestId("heading")).toBeInTheDocument();
    });
  });

  describe("getStaticProps", () => {
    it("should fail if no props specified", async () => {
      await expect(async () => {
        await getStaticProps({});
      }).rejects.toThrow("Missing params");
    });
  });

  describe("getStaticPaths", () => {
    it("Should return expected data", async () => {
      const paths = await getStaticPaths();
      expect(paths).toEqual({ fallback: "blocking", paths: [] });
    });
  });
});
