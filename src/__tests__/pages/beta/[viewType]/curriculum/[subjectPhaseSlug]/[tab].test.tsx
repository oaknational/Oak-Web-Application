import CurriculumInfoPage, {
  parseSubjectPhaseSlug,
  getStaticProps,
  getStaticPaths,
} from "@/pages/beta/[viewType]/curriculum/[subjectPhaseSlug]/[tab]";
import curriculumOverviewTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import curriculumUnitsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumUnits.fixture";
import curriculumDownloadsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumDownloads.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import subjectPhaseOptions from "@/browser-lib/fixtures/subjectPhaseOptions";

const render = renderWithProviders();

describe("pages/beta/[viewType]/curriculum/[subjectPhaseSlug]/[tab]", () => {
  describe("parses the subject / phase / examboard slug correctly", () => {
    it("should extract from a valid slug", () => {
      const slug = "english-secondary-aqa";
      const parsed = parseSubjectPhaseSlug(slug);
      expect(parsed).toEqual({
        subjectSlug: "english",
        phaseSlug: "secondary",
        examboardSlug: "aqa",
      });
    });
    it("should reject an invalid slug", () => {
      const slug = "not_a_valid_slug";
      expect(() => parseSubjectPhaseSlug(slug)).toThrow(
        "The params provided are incorrect"
      );
    });
  });

  describe("components rendering on page", () => {
    it("renders the Curriculum Overview", () => {
      const slugs = parseSubjectPhaseSlug("english-secondary-aqa");
      const { queryByTestId } = render(
        <CurriculumInfoPage
          curriculumSelectionSlugs={slugs}
          subjectPhaseOptions={subjectPhaseOptions}
          curriculumOverviewTabData={curriculumOverviewTabFixture()}
          curriculumUnitsTabData={curriculumUnitsTabFixture()}
          curriculumDownloadTabData={curriculumDownloadsTabFixture()}
        />
      );
      expect(queryByTestId("tabularNav")).toBeInTheDocument();
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
