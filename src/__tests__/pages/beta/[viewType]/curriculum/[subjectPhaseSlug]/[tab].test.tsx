import { useRouter } from "next/router";
import { MockedFunction } from "jest-mock";

import curriculumApi from "@/node-lib/curriculum-api-2023";
import CurriculumInfoPage, {
  parseSubjectPhaseSlug,
  getStaticProps,
  getStaticPaths,
} from "@/pages/beta/[viewType]/curriculum/[subjectPhaseSlug]/[tab]";
import { fetchSubjectPhasePickerData } from "@/pages/beta/[viewType]/curriculum";
import curriculumOverviewTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import curriculumUnitsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumUnits.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import subjectPhaseOptions from "@/browser-lib/fixtures/subjectPhaseOptions";

const render = renderWithProviders();
jest.mock("next/router");
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  curriculumOverview: jest.fn(),
  curriculumUnits: jest.fn(),
}));
const mockedCurriculumOverview =
  curriculumApi.curriculumOverview as MockedFunction<
    typeof curriculumApi.curriculumOverview
  >;
const mockedCurriculumUnits = curriculumApi.curriculumUnits as MockedFunction<
  typeof curriculumApi.curriculumUnits
>;
const mockedFetchSubjectPhasePickerData =
  fetchSubjectPhasePickerData as MockedFunction<
    typeof fetchSubjectPhasePickerData
  >;

jest.mock("@/pages/beta/[viewType]/curriculum/index", () => ({
  fetchSubjectPhasePickerData: jest.fn(),
}));

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
    it("renders the Curriculum Header", () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: { tab: "overview" },
        isPreview: false,
        pathname:
          "/beta/teachers-2023/curriculum/english-secondary-aqa/overview",
      });
      const slugs = parseSubjectPhaseSlug("english-secondary-aqa");
      const { queryByTestId } = render(
        <CurriculumInfoPage
          curriculumSelectionSlugs={slugs}
          subjectPhaseOptions={subjectPhaseOptions}
          curriculumOverviewTabData={curriculumOverviewTabFixture()}
          curriculumUnitsTabData={curriculumUnitsTabFixture()}
        />
      );
      expect(queryByTestId("tabularNav")).toBeInTheDocument();
    });

    it("renders the Curriculum Overview Tab", () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: { tab: "overview" },
        isPreview: false,
        pathname:
          "/beta/teachers-2023/curriculum/english-secondary-aqa/overview",
      });
      const slugs = parseSubjectPhaseSlug("english-secondary-aqa");
      const { queryByTestId, queryAllByTestId } = render(
        <CurriculumInfoPage
          curriculumSelectionSlugs={slugs}
          subjectPhaseOptions={subjectPhaseOptions}
          curriculumOverviewTabData={curriculumOverviewTabFixture()}
          curriculumUnitsTabData={curriculumUnitsTabFixture()}
        />
      );
      expect(queryByTestId("intent-heading")).toBeInTheDocument();
      expect(queryAllByTestId("subject-principles")).toHaveLength(4);
    });

    it("renders the Curriculum Units Tab", () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: { tab: "units" },
        isPreview: false,
        pathname:
          "/beta/teachers-2023/curriculum/english-secondary-aqa/overview",
      });
      const slugs = parseSubjectPhaseSlug("english-secondary-aqa");
      const { queryByTestId, queryAllByTestId } = render(
        <CurriculumInfoPage
          curriculumSelectionSlugs={slugs}
          subjectPhaseOptions={subjectPhaseOptions}
          curriculumOverviewTabData={curriculumOverviewTabFixture()}
          curriculumUnitsTabData={curriculumUnitsTabFixture()}
        />
      );
      expect(queryByTestId("units-heading")).toBeInTheDocument();
      expect(queryAllByTestId("unit-cards")[0]).toBeInTheDocument();
    });
  });

  describe("getStaticProps", () => {
    it("should fail if no props specified", async () => {
      await expect(async () => {
        await getStaticProps({});
      }).rejects.toThrow("Missing params");
    });

    it("should return expected props", async () => {
      mockedCurriculumOverview.mockResolvedValue(
        curriculumOverviewTabFixture()
      );
      mockedCurriculumUnits.mockResolvedValue(curriculumUnitsTabFixture());
      mockedFetchSubjectPhasePickerData.mockResolvedValue(subjectPhaseOptions);
      const slugs = parseSubjectPhaseSlug("english-secondary-aqa");
      const props = await getStaticProps({
        params: {
          tab: "overview",
          subjectPhaseSlug: "english-secondary-aqa",
          viewType: "teachers-2023",
        },
      });
      expect(props).toEqual({
        props: {
          curriculumSelectionSlugs: slugs,
          subjectPhaseOptions: subjectPhaseOptions,
          curriculumOverviewTabData: curriculumOverviewTabFixture(),
          curriculumUnitsTabData: curriculumUnitsTabFixture(),
        },
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should return expected data", async () => {
      const paths = await getStaticPaths();
      expect(paths).toEqual({ fallback: "blocking", paths: [] });
    });
  });
});
