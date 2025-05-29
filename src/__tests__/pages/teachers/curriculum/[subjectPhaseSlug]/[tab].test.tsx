import { screen } from "@testing-library/react";
import { useRouter } from "next/router";

import CMSClient from "@/node-lib/cms";
import curriculumApi from "@/node-lib/curriculum-api-2023";
import CurriculumInfoPage, {
  getStaticProps,
  getStaticPaths,
} from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[...slugs]";
import {
  curriculumOverviewCMSFixture,
  curriculumOverviewMVFixture,
} from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import curriculumUnitsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumUnits.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import curriculumPhaseOptions from "@/browser-lib/fixtures/curriculumPhaseOptions";
import { parseSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import "@/__tests__/__helpers__/ResizeObserverMock";
import {
  // createInitialYearFilterSelection,
  createThreadOptions,
  createUnitsListingByYear,
  createYearOptions,
  fetchSubjectPhasePickerData,
  formatCurriculumUnitsData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { DISABLE_DOWNLOADS } from "@/utils/curriculum/constants";

const render = renderWithProviders();

const unitData = [
  {
    connection_prior_unit_description:
      "Pupils learned about the roles of hormones in human reproduction, including control of the menstrual cycle, and other uses of hormones such as in in contraception.",
    connection_future_unit_description:
      "Pupils will learn about uses of gene technology in medicine, such as for genetic testing, and in agriculture, such as the production of genetically engineered crop plants with desirable characteristics.",
    connection_future_unit_title: "Gene technology",
    connection_prior_unit_title: "Hormones and human reproduction",
    domain: null,
    domain_id: null,
    examboard: "AQA",
    examboard_slug: "aqa",
    planned_number_of_lessons: 6,
    phase: "Secondary",
    phase_slug: "secondary",
    keystage_slug: "ks4",
    lessons: [
      { slug: "plant-hormones", title: "Plant hormones", _state: "new" },
      {
        slug: "auxins-phototropism-and-gravitropism",
        title: "Auxins, phototropism and gravitropism",
        _state: "new",
      },
      {
        slug: "the-effect-of-light-on-the-growth-of-seedlings",
        title: "The effect of light on the growth of seedlings ",
        _state: "new",
      },
      {
        slug: "the-effect-of-gravity-on-the-growth-of-seedlings",
        title: "The effect of gravity on the growth of seedlings",
        _state: "new",
      },
      {
        slug: "the-effects-of-light-and-gravity-on-the-growth-of-seedlings-interpreting-and-explaining-the-results",
        title:
          "The effects of light and gravity on the growth of seedlings: interpreting and explaining the results",
        _state: "new",
      },
    ],
    order: 6,
    slug: "plant-growth-and-development",
    state: "published",
    subject: "Biology",
    subject_slug: "biology",
    subject_parent: "Science",
    subject_parent_slug: "science",
    tier: "Foundation",
    tier_slug: "foundation",
    tags: [],
    subjectcategories: [],
    threads: [
      {
        title: "BQ02 Biology: How do living things grow and reproduce?",
        slug: "bq02-biology-how-do-living-things-grow-and-reproduce",
        order: 2,
      },
    ],
    title: "Plant growth and development",
    unit_options: [],
    year: "11",
    cycle: "1",
    why_this_why_now: null,
    description: null,
  },
  {
    connection_prior_unit_description:
      "In Y4 pupils learnt about their local environment and to recognise that environments can change. Pupils also explored examples of human impact (both positive and negative) on environments. Pupils looked at a variety of food chains to identify producers, predators and prey.",
    connection_future_unit_description:
      "Pupils will move on to construct and interpret pyramids of number and biomass from food chains data. Pupils will learn about how plants and animals are adapted to survive and the impact of changes to the environment on biodiversity. The importance of biodiversity and the importance of gene banks. How to sample plant and animal populations to aid our understanding and monitoring of populations. ",
    connection_future_unit_title: "Biodiversity",
    connection_prior_unit_title: "More about food chains",
    domain: null,
    domain_id: null,
    examboard: null,
    examboard_slug: null,
    planned_number_of_lessons: 9,
    phase: "Secondary",
    phase_slug: "secondary",
    keystage_slug: "ks3",
    lessons: [
      { slug: "food-chains", title: "Food chains", _state: "published" },
      {
        slug: "predator-prey-relationships",
        title: "Predator-prey relationships",
        _state: "published",
      },
      {
        slug: "adaptations-of-predators-and-prey",
        title: "Adaptations of predators and prey",
        _state: "published",
      },
      { slug: "food-webs", title: "Food webs", _state: "published" },
      {
        slug: "ecosystems-and-habitats",
        title: "Ecosystems and habitats",
        _state: "published",
      },
      {
        slug: "pollination-and-human-food-security",
        title: "Pollination and human food security",
        _state: "published",
      },
      {
        slug: "using-chemicals-in-farming",
        title: "Using chemicals in farming",
        _state: "published",
      },
      {
        slug: "bioaccumulation",
        title: "Bioaccumulation",
        _state: "published",
      },
      {
        slug: "the-importance-of-biodiversity",
        title: "The importance of biodiversity",
        _state: "published",
      },
    ],
    order: 6,
    slug: "ecosystems",
    state: "published",
    subject: "Science",
    subject_slug: "science",
    subject_parent: null,
    subject_parent_slug: null,
    tier: null,
    tier_slug: null,
    tags: [{ id: 5, title: "Biology", category: "Discipline" }],
    subjectcategories: [{ id: 5, slug: "biology", title: "Biology" }],
    threads: [
      {
        title:
          "BQ03 Biology: How do living things live together in their environments?",
        slug: "bq03-biology-how-do-living-things-live-together-in-their-environments",
        order: 3,
      },
    ],
    title: "Ecosystems",
    unit_options: [],
    year: "7",
    cycle: "1",
    why_this_why_now: null,
    description: null,
  },
  {
    connection_prior_unit_description:
      "Pupils learned about some common non-infectious diseases, factors that increase the risk of developing lifestyle diseases and steps we can take to help prevent them, including the impacts of smoking on the human body, and asthma and its risk factors.",
    connection_future_unit_description:
      "Pupils will learn about human and plant defences against pathogens, the role of white blood cells in the human immune system, and the use of vaccination to protect against communicable diseases.",
    connection_future_unit_title:
      "Defences against pathogens, the human immune system and vaccination",
    connection_prior_unit_title: "Disease and drugs",
    domain: null,
    domain_id: null,
    examboard: "AQA",
    examboard_slug: "aqa",
    planned_number_of_lessons: 14,
    phase: "Secondary",
    phase_slug: "secondary",
    keystage_slug: "ks4",
    lessons: [
      { slug: "diseases", title: "Diseases", _state: "new" },
      {
        slug: "cardiovascular-disease",
        title: "Cardiovascular disease",
        _state: "new",
      },
      {
        slug: "risk-factors-for-non-communicable-diseases",
        title: "Risk factors for non-communicable diseases",
        _state: "new",
      },
      { slug: "cancer", title: "Cancer", _state: "new" },
      {
        slug: "bacterial-and-viral-diseases-in-humans-salmonella-and-measles",
        title: "Bacterial and viral diseases in humans: salmonella and measles",
        _state: "new",
      },
      {
        slug: "fungal-and-protist-diseases-in-humans",
        title: "Fungal and protist diseases in humans",
        _state: "new",
      },
      {
        slug: "sexually-transmitted-infections",
        title: "Sexually transmitted infections",
        _state: "new",
      },
      {
        slug: "plant-diseases-tmv-and-rose-black-spot",
        title: "Plant diseases: TMV and rose black spot",
        _state: "published",
      },
    ],
    order: 6,
    slug: "health-and-disease",
    state: "published",
    subject: "Combined science",
    subject_slug: "combined-science",
    subject_parent: "Science",
    subject_parent_slug: "science",
    tier: null,
    tier_slug: null,
    tags: [],
    subjectcategories: [],
    threads: [
      {
        title: "BQ05 Biology: How do living things stay healthy?",
        slug: "bq05-biology-how-do-living-things-stay-healthy",
        order: 5,
      },
    ],
    title: "Health and disease",
    unit_options: [],
    year: "10",
    cycle: "1",
    why_this_why_now: null,
    description: null,
  },
  {
    connection_prior_unit_description:
      "Pupils learned how substances essential for chemical reactions, and the products of the reactions, are transported into, around and out of plants, and about factors affecting the rate of water uptake by a plant.",
    connection_future_unit_description:
      "Pupils will learn about factors that affect the rate of photosynthesis in plants, including temperature, light intensity and carbon dioxide concentration.",
    connection_future_unit_title: "Photosynthesis: factors affecting the rate",
    connection_prior_unit_title: "Transport and exchange surfaces in plants",
    domain: null,
    domain_id: null,
    examboard: "AQA",
    examboard_slug: "aqa",
    planned_number_of_lessons: 13,
    phase: "Secondary",
    phase_slug: "secondary",
    state: "published",
    keystage_slug: "ks4",
    lessons: [
      {
        slug: "the-effect-of-sugar-concentration-on-mass-of-plant-tissue-plan",
        title:
          "The effect of sugar concentration on mass of plant tissue: plan",
        _state: "new",
      },
      {
        slug: "the-effect-of-sugar-concentration-on-mass-of-plant-tissue-practical",
        title:
          "The effect of sugar concentration on mass of plant tissue: practical",
        _state: "new",
      },
      {
        slug: "the-effect-of-sugar-concentration-on-mass-of-plant-tissue-analysis",
        title:
          "The effect of sugar concentration on mass of plant tissue: analysis",
        _state: "new",
      },
      {
        slug: "the-importance-of-maintaining-a-constant-internal-environment",
        title: "The importance of maintaining a constant internal environment",
        _state: "new",
      },
      {
        slug: "the-role-of-the-skin-in-controlling-human-body-temperature",
        title: "The role of the skin in controlling human body temperature",
        _state: "new",
      },
      {
        slug: "the-role-of-the-nervous-system-in-controlling-human-body-temperature",
        title:
          "The role of the nervous system in controlling human body temperature",
        _state: "new",
      },
      {
        slug: "the-role-of-the-kidneys-in-controlling-water-balance-in-the-human-body",
        title:
          "The role of the kidneys in controlling water balance in the human body",
        _state: "new",
      },
      {
        slug: "the-roles-of-the-nervous-and-endocrine-systems-in-controlling-water-balance",
        title:
          "The roles of the nervous and endocrine systems in controlling water balance",
        _state: "new",
      },
    ],
    order: 7,
    slug: "coordination-and-control-maintaining-a-constant-internal-environment",
    subject: "Biology",
    subject_slug: "biology",
    subject_parent: "Science",
    subject_parent_slug: "science",
    tier: "Higher",
    tier_slug: "higher",
    tags: [],
    subjectcategories: [],
    threads: [
      {
        title:
          "BQ01 Biology: What are living things and what are they made of?",
        slug: "bq01-biology-what-are-living-things-and-what-are-they-made-of",
        order: 1,
      },
    ],
    title:
      "Coordination and control: maintaining a constant internal environment",
    unit_options: [],
    year: "11",
    cycle: "1",
    why_this_why_now: null,
    description: null,
  },
  {
    connection_prior_unit_description:
      "Pupils learned how substances essential for chemical reactions, and the products of the reactions, are transported into, around and out of plants, and about factors affecting the rate of water uptake by a plant.",
    connection_future_unit_description:
      "Pupils will learn about factors that affect the rate of photosynthesis in plants, including temperature, light intensity and carbon dioxide concentration.",
    connection_future_unit_title: "Photosynthesis: factors affecting the rate",
    connection_prior_unit_title: "Transport and exchange surfaces in plants",
    domain: null,
    domain_id: null,
    examboard: "AQA",
    examboard_slug: "aqa",
    planned_number_of_lessons: 13,
    phase: "Secondary",
    phase_slug: "secondary",
    keystage_slug: "ks4",
    lessons: [
      {
        slug: "the-effect-of-sugar-concentration-on-mass-of-plant-tissue-plan",
        title:
          "The effect of sugar concentration on mass of plant tissue: plan",
        _state: "new",
      },
      {
        slug: "the-effect-of-sugar-concentration-on-mass-of-plant-tissue-practical",
        title:
          "The effect of sugar concentration on mass of plant tissue: practical",
        _state: "new",
      },
      {
        slug: "the-effect-of-sugar-concentration-on-mass-of-plant-tissue-analysis",
        title:
          "The effect of sugar concentration on mass of plant tissue: analysis",
        _state: "new",
      },
      {
        slug: "the-importance-of-maintaining-a-constant-body-temperature",
        title: "The importance of maintaining a constant body temperature",
        _state: "new",
      },
      {
        slug: "the-importance-of-maintaining-a-constant-water-balance-in-the-body",
        title:
          "The importance of maintaining a constant water balance in the body",
        _state: "new",
      },
      {
        slug: "the-role-of-the-skin-in-controlling-human-body-temperature",
        title: "The role of the skin in controlling human body temperature",
        _state: "new",
      },
      {
        slug: "the-role-of-the-kidneys-in-controlling-water-balance-in-the-human-body",
        title:
          "The role of the kidneys in controlling water balance in the human body",
        _state: "new",
      },
    ],
    order: 7,
    slug: "coordination-and-control-maintaining-a-constant-internal-environment",
    state: "published",
    subject: "Biology",
    subject_slug: "biology",
    subject_parent: "Science",
    subject_parent_slug: "science",
    tier: "Foundation",
    tier_slug: "foundation",
    tags: [],
    subjectcategories: [],
    threads: [
      {
        title:
          "BQ01 Biology: What are living things and what are they made of?",
        slug: "bq01-biology-what-are-living-things-and-what-are-they-made-of",
        order: 1,
      },
    ],
    title:
      "Coordination and control: maintaining a constant internal environment",
    unit_options: [],
    year: "11",
    cycle: "1",
    why_this_why_now: null,
    description: null,
  },
  {
    connection_prior_unit_description:
      "Pupils learned about aerobic and anaerobic cellular respiration, including the chemical reactants and products of the processes, and practical ways to measure the rate of cellular respiration in living cells.",
    connection_future_unit_description:
      "Pupils will learn about ways in which the human body maintains a constant internal environment in response to internal and external change, including changes in temperature and water balance.",
    connection_future_unit_title:
      "Coordination and control: maintaining a constant internal environment",
    connection_prior_unit_title: "Aerobic and anaerobic cellular respiration",
    domain: null,
    domain_id: null,
    examboard: "AQA",
    examboard_slug: "aqa",
    planned_number_of_lessons: 12,
    phase: "Secondary",
    phase_slug: "secondary",
    keystage_slug: "ks4",
    lessons: [
      {
        slug: "a-model-of-diffusion-through-a-selectively-permeable-cell-membrane",
        title:
          "A model of diffusion through a selectively-permeable cell membrane ",
        _state: "new",
      },
      {
        slug: "plant-roots-are-adapted-to-absorb-water-and-mineral-ions",
        title: "Plant roots are adapted to absorb water and mineral ions",
        _state: "new",
      },
      {
        slug: "transport-systems-in-plants-xylem-and-phloem",
        title: "Transport systems in plants: xylem and phloem",
        _state: "new",
      },
      {
        slug: "transport-systems-in-plants-translocation",
        title: "Transport systems in plants: translocation",
        _state: "new",
      },
      {
        slug: "transport-systems-in-plants-transpiration",
        title: "Transport systems in plants: transpiration",
        _state: "new",
      },
      {
        slug: "measuring-the-rate-of-water-uptake-by-a-plant",
        title: "Measuring the rate of water uptake by a plant",
        _state: "new",
      },
      {
        slug: "the-effect-of-light-intensity-on-the-rate-of-water-uptake-by-a-plant",
        title:
          "The effect of light intensity on the rate of water uptake by a plant",
        _state: "new",
      },
      {
        slug: "the-importance-of-exchange-surfaces-and-transport-systems-in-plants",
        title:
          "The importance of exchange surfaces and transport systems in plants",
        _state: "new",
      },
    ],
    order: 7,
    slug: "transport-and-exchange-surfaces-in-plants",
    state: "published",
    subject: "Combined science",
    subject_slug: "combined-science",
    subject_parent: "Science",
    subject_parent_slug: "science",
    tier: null,
    tier_slug: null,
    tags: [],
    subjectcategories: [],
    threads: [
      {
        title:
          "BQ01 Biology: What are living things and what are they made of?",
        slug: "bq01-biology-what-are-living-things-and-what-are-they-made-of",
        order: 1,
      },
    ],
    title: "Transport and exchange surfaces in plants",
    unit_options: [],
    year: "11",
    cycle: "1",
    why_this_why_now: null,
    description: null,
  },
];

const mockCurriculumDownloadsData = {
  child_subjects: [
    {
      subject: "Combined science",
      subject_slug: "combined-science",
    },
    {
      subject: "Biology",
      subject_slug: "biology",
    },
    {
      subject: "Chemistry",
      subject_slug: "chemistry",
    },
    {
      subject: "Physics",
      subject_slug: "physics",
    },
  ],
  tiers: [
    {
      tier: "Foundation",
      tier_slug: "foundation",
    },
    {
      tier: "Higher",
      tier_slug: "higher",
    },
  ],
};

jest.mock("next/router");
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  curriculumOverview: jest.fn(),
  curriculumSequence: jest.fn(),
  curriculumUnits: jest.fn(),
  refreshedMVTime: jest.fn(),
  curriculumPhaseOptions: jest.fn(() => curriculumPhaseOptions.subjects),
}));
const mockedCurriculumOverview = curriculumApi.curriculumOverview as jest.Mock;
const mockedRefreshedMVTime = curriculumApi.refreshedMVTime as jest.Mock;
jest.mock("@/node-lib/cms");

jest.mock("@/hooks/useAnalyticsPageProps.ts", () => ({
  __esModule: true,
  default: () => () => null,
}));

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const mockedCurriculumSequence = curriculumApi.curriculumSequence as jest.Mock;
const mockedFetchSubjectPhasePickerData =
  fetchSubjectPhasePickerData as jest.Mock;

jest.mock("@/pages-helpers/curriculum/docx/tab-helpers", () => ({
  ...jest.requireActual("@/pages-helpers/curriculum/docx/tab-helpers"),
  fetchSubjectPhasePickerData: jest.fn(),
}));

jest.mock("@/hooks/useMediaQuery.tsx", () => ({
  __esModule: true,
  default: () => ({
    isMobile: false,
  }),
}));

const curriculumUnitsFormattedData = formatCurriculumUnitsData(
  curriculumUnitsTabFixture(),
);
describe("pages/teachers/curriculum/[subjectPhaseSlug]/[tab]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  describe("components rendering on page", () => {
    it("renders the Curriculum Header", () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: { slugs: ["overview"] },
        isPreview: false,
        pathname: "/teachers-2023/curriculum/english-secondary-aqa/overview",
        asPath: "",
      });

      const slugs = parseSubjectPhaseSlug("english-secondary-aqa")!;
      const { queryByTestId } = render(
        <CurriculumInfoPage
          mvRefreshTime={1721314874829}
          curriculumUnitsFormattedData={curriculumUnitsFormattedData}
          curriculumSelectionSlugs={slugs}
          curriculumPhaseOptions={curriculumPhaseOptions}
          curriculumOverviewSanityData={curriculumOverviewCMSFixture()}
          curriculumOverviewTabData={curriculumOverviewMVFixture()}
          curriculumDownloadsTabData={{ tiers: [], child_subjects: [] }}
        />,
      );
      expect(queryByTestId("tabularNav")).toBeInTheDocument();
    });

    describe("Curriculum Downloads Tab: Secondary Maths", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        const mockIntersectionObserver = jest.fn();
        mockIntersectionObserver.mockReturnValue({
          observe: () => null,
          unobserve: () => null,
          disconnect: () => null,
        });
        window.IntersectionObserver = mockIntersectionObserver;
      });

      test("user can see the tier selector for secondary maths", async () => {
        // Mock for useRouter to provide the correct router query and other properties
        (useRouter as jest.Mock).mockReturnValue({
          query: { slugs: ["downloads"], subjectPhaseSlug: "maths-secondary" },
          isPreview: false,
          pathname: "/teachers-2023/curriculum/maths-secondary/downloads",
          asPath: "",
        });

        // Render the CurriculumInfoPage with necessary mock props
        const slugs = parseSubjectPhaseSlug("maths-secondary")!;
        const { queryByTestId } = render(
          <CurriculumInfoPage
            mvRefreshTime={1721314874829}
            curriculumUnitsFormattedData={curriculumUnitsFormattedData}
            curriculumSelectionSlugs={slugs}
            curriculumPhaseOptions={curriculumPhaseOptions}
            curriculumOverviewSanityData={curriculumOverviewCMSFixture()}
            curriculumOverviewTabData={curriculumOverviewMVFixture()}
            curriculumDownloadsTabData={{
              tiers: [
                { tier: "Higher", tier_slug: "higher" },
                { tier: "Foundation", tier_slug: "foundation" },
              ],
              child_subjects: [],
            }}
          />,
        );

        const formHeading = screen.getByRole("heading", {
          name: "Download",
          level: 2,
        });
        expect(formHeading).toBeInTheDocument();

        // Find and test the Tier Selector element by its test ID
        const tierSelector = await queryByTestId("tier-selector");
        expect(tierSelector).toBeInTheDocument();
      });
    });

    it.skip("renders the Curriculum Units Tab", () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: { tab: "units" },
        isPreview: false,
        pathname: "/teachers-2023/curriculum/english-secondary-aqa/overview",
        asPath: "",
      });
      const slugs = parseSubjectPhaseSlug("english-secondary-aqa")!;
      const { queryByTestId, queryAllByTestId } = render(
        <CurriculumInfoPage
          mvRefreshTime={1721314874829}
          curriculumUnitsFormattedData={curriculumUnitsFormattedData}
          curriculumSelectionSlugs={slugs}
          curriculumPhaseOptions={curriculumPhaseOptions}
          curriculumOverviewSanityData={curriculumOverviewCMSFixture()}
          curriculumOverviewTabData={curriculumOverviewMVFixture()}
          curriculumDownloadsTabData={{ tiers: [], child_subjects: [] }}
        />,
      );
      expect(queryByTestId("units-heading")).toBeInTheDocument();
      expect(queryAllByTestId("unit-cards")[0]).toBeInTheDocument();
    });

    if (!DISABLE_DOWNLOADS) {
      it("renders the Curriculum Downloads Tab (with prerelease)", () => {
        (useRouter as jest.Mock).mockReturnValue({
          query: { slugs: ["downloads"] },
          isPreview: false,
          pathname: "/teachers-2023/curriculum/english-secondary-aqa/downloads",
        });
        const slugs = parseSubjectPhaseSlug("english-secondary-aqa")!;
        const { queryByTestId } = render(
          <CurriculumInfoPage
            mvRefreshTime={1721314874829}
            curriculumUnitsFormattedData={curriculumUnitsFormattedData}
            curriculumSelectionSlugs={slugs}
            curriculumPhaseOptions={curriculumPhaseOptions}
            curriculumOverviewSanityData={curriculumOverviewCMSFixture()}
            curriculumOverviewTabData={curriculumOverviewMVFixture()}
            curriculumDownloadsTabData={{ tiers: [], child_subjects: [] }}
          />,
        );
        expect(queryByTestId("download-heading")).toBeInTheDocument();
      });
    }
  });

  describe("getStaticProps", () => {
    it("should fail if no props specified", async () => {
      await expect(async () => {
        await getStaticProps({});
      }).rejects.toThrow("Missing params");
    });

    it("should return expected props", async () => {
      const unitsTabFixture = curriculumUnitsTabFixture();
      unitsTabFixture.units.sort((a, b) => a.order - b.order);
      mockCMSClient.curriculumOverviewPage.mockResolvedValue(
        curriculumOverviewCMSFixture(),
      );
      mockedRefreshedMVTime.mockResolvedValue({
        data: [
          {
            last_refresh_finish: "2024-07-07T00:00:04.01694+00:00",
            materializedview_name: "mv_curriculum_sequence_b_13_0_4",
          },
        ],
      });
      mockedCurriculumOverview.mockResolvedValue(curriculumOverviewMVFixture());

      mockedCurriculumSequence.mockResolvedValue(unitsTabFixture);
      mockedFetchSubjectPhasePickerData.mockResolvedValue(
        curriculumPhaseOptions,
      );

      const slugs = parseSubjectPhaseSlug("english-secondary-aqa");
      const props = await getStaticProps({
        params: {
          slugs: ["overview"],
          subjectPhaseSlug: "english-secondary-aqa",
        },
      });

      expect(props).toEqual({
        props: {
          mvRefreshTime: 1720310404016,
          curriculumSelectionSlugs: slugs,
          curriculumPhaseOptions: curriculumPhaseOptions,
          curriculumOverviewSanityData: curriculumOverviewCMSFixture(),
          curriculumOverviewTabData: curriculumOverviewMVFixture(),
          curriculumUnitsFormattedData:
            formatCurriculumUnitsData(unitsTabFixture),
          curriculumDownloadsTabData: mockCurriculumDownloadsData,
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

  describe("createThreadOptions", () => {
    it("Should create the correct thread options for secondary science", () => {
      const scienceSecondaryAQAThreadOptions = [
        {
          title:
            "BQ01 Biology: What are living things and what are they made of?",
          slug: "bq01-biology-what-are-living-things-and-what-are-they-made-of",
          order: 1,
        },
        {
          title: "BQ02 Biology: How do living things grow and reproduce?",
          slug: "bq02-biology-how-do-living-things-grow-and-reproduce",
          order: 2,
        },
        {
          title:
            "BQ03 Biology: How do living things live together in their environments?",
          slug: "bq03-biology-how-do-living-things-live-together-in-their-environments",
          order: 3,
        },
        {
          title: "BQ05 Biology: How do living things stay healthy?",
          slug: "bq05-biology-how-do-living-things-stay-healthy",
          order: 5,
        },
      ];
      expect(createThreadOptions(unitData)).toEqual(
        scienceSecondaryAQAThreadOptions,
      );
    });
  });

  describe("createYearOptions", () => {
    it("Should create the correct year options for secondary science", () => {
      const scienceSecondaryAQAYearOptions = ["7", "10", "11"];
      expect(createYearOptions(unitData)).toEqual(
        scienceSecondaryAQAYearOptions,
      );
    });
  });

  describe("createUnitsListingByYear", () => {
    it("Should create unitListingByYear", () => {
      const unitListingByYear = {
        "10": {
          childSubjects: [
            {
              subject: "Combined science",
              subject_slug: "combined-science",
            },
          ],
          pathways: [],
          subjectCategories: [],
          tiers: [],
          units: [
            {
              connection_future_unit_description:
                "Pupils will learn about human and plant defences against pathogens, the role of white blood cells in the human immune system, and the use of vaccination to protect against communicable diseases.",
              connection_future_unit_title:
                "Defences against pathogens, the human immune system and vaccination",
              connection_prior_unit_description:
                "Pupils learned about some common non-infectious diseases, factors that increase the risk of developing lifestyle diseases and steps we can take to help prevent them, including the impacts of smoking on the human body, and asthma and its risk factors.",
              connection_prior_unit_title: "Disease and drugs",
              domain: null,
              domain_id: null,
              examboard: "AQA",
              examboard_slug: "aqa",
              keystage_slug: "ks4",
              lessons: [
                {
                  _state: "new",
                  slug: "diseases",
                  title: "Diseases",
                },
                {
                  _state: "new",
                  slug: "cardiovascular-disease",
                  title: "Cardiovascular disease",
                },
                {
                  _state: "new",
                  slug: "risk-factors-for-non-communicable-diseases",
                  title: "Risk factors for non-communicable diseases",
                },
                {
                  _state: "new",
                  slug: "cancer",
                  title: "Cancer",
                },
                {
                  _state: "new",
                  slug: "bacterial-and-viral-diseases-in-humans-salmonella-and-measles",
                  title:
                    "Bacterial and viral diseases in humans: salmonella and measles",
                },
                {
                  _state: "new",
                  slug: "fungal-and-protist-diseases-in-humans",
                  title: "Fungal and protist diseases in humans",
                },
                {
                  _state: "new",
                  slug: "sexually-transmitted-infections",
                  title: "Sexually transmitted infections",
                },
                {
                  _state: "published",
                  slug: "plant-diseases-tmv-and-rose-black-spot",
                  title: "Plant diseases: TMV and rose black spot",
                },
              ],
              order: 6,
              phase: "Secondary",
              phase_slug: "secondary",
              planned_number_of_lessons: 14,
              slug: "health-and-disease",
              subject: "Combined science",
              subject_parent: "Science",
              subject_parent_slug: "science",
              subject_slug: "combined-science",
              tags: [],
              subjectcategories: [],
              threads: [
                {
                  order: 5,
                  slug: "bq05-biology-how-do-living-things-stay-healthy",
                  title: "BQ05 Biology: How do living things stay healthy?",
                },
              ],
              tier: null,
              tier_slug: null,
              title: "Health and disease",
              unit_options: [],
              year: "10",
              cycle: "1",
              description: null,
              why_this_why_now: null,
              state: "published",
            },
          ],
          groupAs: null,
          isSwimming: false,
        },
        "11": {
          childSubjects: [
            {
              subject: "Biology",
              subject_slug: "biology",
            },
            {
              subject: "Combined science",
              subject_slug: "combined-science",
            },
          ],
          pathways: [],
          subjectCategories: [],
          tiers: [
            {
              tier: "Foundation",
              tier_slug: "foundation",
            },
            {
              tier: "Higher",
              tier_slug: "higher",
            },
          ],
          units: [
            {
              connection_future_unit_description:
                "Pupils will learn about uses of gene technology in medicine, such as for genetic testing, and in agriculture, such as the production of genetically engineered crop plants with desirable characteristics.",
              connection_future_unit_title: "Gene technology",
              connection_prior_unit_description:
                "Pupils learned about the roles of hormones in human reproduction, including control of the menstrual cycle, and other uses of hormones such as in in contraception.",
              connection_prior_unit_title: "Hormones and human reproduction",
              domain: null,
              domain_id: null,
              examboard: "AQA",
              examboard_slug: "aqa",
              keystage_slug: "ks4",
              lessons: [
                {
                  _state: "new",
                  slug: "plant-hormones",
                  title: "Plant hormones",
                },
                {
                  _state: "new",
                  slug: "auxins-phototropism-and-gravitropism",
                  title: "Auxins, phototropism and gravitropism",
                },
                {
                  _state: "new",
                  slug: "the-effect-of-light-on-the-growth-of-seedlings",
                  title: "The effect of light on the growth of seedlings ",
                },
                {
                  _state: "new",
                  slug: "the-effect-of-gravity-on-the-growth-of-seedlings",
                  title: "The effect of gravity on the growth of seedlings",
                },
                {
                  _state: "new",
                  slug: "the-effects-of-light-and-gravity-on-the-growth-of-seedlings-interpreting-and-explaining-the-results",
                  title:
                    "The effects of light and gravity on the growth of seedlings: interpreting and explaining the results",
                },
              ],
              order: 6,
              phase: "Secondary",
              phase_slug: "secondary",
              planned_number_of_lessons: 6,
              slug: "plant-growth-and-development",
              subject: "Biology",
              subject_parent: "Science",
              subject_parent_slug: "science",
              subject_slug: "biology",
              tags: [],
              subjectcategories: [],
              threads: [
                {
                  order: 2,
                  slug: "bq02-biology-how-do-living-things-grow-and-reproduce",
                  title:
                    "BQ02 Biology: How do living things grow and reproduce?",
                },
              ],
              tier: "Foundation",
              tier_slug: "foundation",
              title: "Plant growth and development",
              unit_options: [],
              year: "11",
              cycle: "1",
              description: null,
              why_this_why_now: null,
              state: "published",
            },
            {
              connection_future_unit_description:
                "Pupils will learn about factors that affect the rate of photosynthesis in plants, including temperature, light intensity and carbon dioxide concentration.",
              connection_future_unit_title:
                "Photosynthesis: factors affecting the rate",
              connection_prior_unit_description:
                "Pupils learned how substances essential for chemical reactions, and the products of the reactions, are transported into, around and out of plants, and about factors affecting the rate of water uptake by a plant.",
              connection_prior_unit_title:
                "Transport and exchange surfaces in plants",
              domain: null,
              domain_id: null,
              examboard: "AQA",
              examboard_slug: "aqa",
              keystage_slug: "ks4",
              lessons: [
                {
                  _state: "new",
                  slug: "the-effect-of-sugar-concentration-on-mass-of-plant-tissue-plan",
                  title:
                    "The effect of sugar concentration on mass of plant tissue: plan",
                },
                {
                  _state: "new",
                  slug: "the-effect-of-sugar-concentration-on-mass-of-plant-tissue-practical",
                  title:
                    "The effect of sugar concentration on mass of plant tissue: practical",
                },
                {
                  _state: "new",
                  slug: "the-effect-of-sugar-concentration-on-mass-of-plant-tissue-analysis",
                  title:
                    "The effect of sugar concentration on mass of plant tissue: analysis",
                },
                {
                  _state: "new",
                  slug: "the-importance-of-maintaining-a-constant-internal-environment",
                  title:
                    "The importance of maintaining a constant internal environment",
                },
                {
                  _state: "new",
                  slug: "the-role-of-the-skin-in-controlling-human-body-temperature",
                  title:
                    "The role of the skin in controlling human body temperature",
                },
                {
                  _state: "new",
                  slug: "the-role-of-the-nervous-system-in-controlling-human-body-temperature",
                  title:
                    "The role of the nervous system in controlling human body temperature",
                },
                {
                  _state: "new",
                  slug: "the-role-of-the-kidneys-in-controlling-water-balance-in-the-human-body",
                  title:
                    "The role of the kidneys in controlling water balance in the human body",
                },
                {
                  _state: "new",
                  slug: "the-roles-of-the-nervous-and-endocrine-systems-in-controlling-water-balance",
                  title:
                    "The roles of the nervous and endocrine systems in controlling water balance",
                },
              ],
              order: 7,
              phase: "Secondary",
              phase_slug: "secondary",
              planned_number_of_lessons: 13,
              slug: "coordination-and-control-maintaining-a-constant-internal-environment",
              subject: "Biology",
              subject_parent: "Science",
              subject_parent_slug: "science",
              subject_slug: "biology",
              tags: [],
              subjectcategories: [],
              threads: [
                {
                  order: 1,
                  slug: "bq01-biology-what-are-living-things-and-what-are-they-made-of",
                  title:
                    "BQ01 Biology: What are living things and what are they made of?",
                },
              ],
              tier: "Higher",
              tier_slug: "higher",
              title:
                "Coordination and control: maintaining a constant internal environment",
              unit_options: [],
              year: "11",
              cycle: "1",
              description: null,
              why_this_why_now: null,
              state: "published",
            },
            {
              connection_future_unit_description:
                "Pupils will learn about factors that affect the rate of photosynthesis in plants, including temperature, light intensity and carbon dioxide concentration.",
              connection_future_unit_title:
                "Photosynthesis: factors affecting the rate",
              connection_prior_unit_description:
                "Pupils learned how substances essential for chemical reactions, and the products of the reactions, are transported into, around and out of plants, and about factors affecting the rate of water uptake by a plant.",
              connection_prior_unit_title:
                "Transport and exchange surfaces in plants",
              domain: null,
              domain_id: null,
              examboard: "AQA",
              examboard_slug: "aqa",
              keystage_slug: "ks4",
              lessons: [
                {
                  _state: "new",
                  slug: "the-effect-of-sugar-concentration-on-mass-of-plant-tissue-plan",
                  title:
                    "The effect of sugar concentration on mass of plant tissue: plan",
                },
                {
                  _state: "new",
                  slug: "the-effect-of-sugar-concentration-on-mass-of-plant-tissue-practical",
                  title:
                    "The effect of sugar concentration on mass of plant tissue: practical",
                },
                {
                  _state: "new",
                  slug: "the-effect-of-sugar-concentration-on-mass-of-plant-tissue-analysis",
                  title:
                    "The effect of sugar concentration on mass of plant tissue: analysis",
                },
                {
                  _state: "new",
                  slug: "the-importance-of-maintaining-a-constant-body-temperature",
                  title:
                    "The importance of maintaining a constant body temperature",
                },
                {
                  _state: "new",
                  slug: "the-importance-of-maintaining-a-constant-water-balance-in-the-body",
                  title:
                    "The importance of maintaining a constant water balance in the body",
                },
                {
                  _state: "new",
                  slug: "the-role-of-the-skin-in-controlling-human-body-temperature",
                  title:
                    "The role of the skin in controlling human body temperature",
                },
                {
                  _state: "new",
                  slug: "the-role-of-the-kidneys-in-controlling-water-balance-in-the-human-body",
                  title:
                    "The role of the kidneys in controlling water balance in the human body",
                },
              ],
              order: 7,
              phase: "Secondary",
              phase_slug: "secondary",
              planned_number_of_lessons: 13,
              slug: "coordination-and-control-maintaining-a-constant-internal-environment",
              subject: "Biology",
              subject_parent: "Science",
              subject_parent_slug: "science",
              subject_slug: "biology",
              tags: [],
              subjectcategories: [],
              threads: [
                {
                  order: 1,
                  slug: "bq01-biology-what-are-living-things-and-what-are-they-made-of",
                  title:
                    "BQ01 Biology: What are living things and what are they made of?",
                },
              ],
              tier: "Foundation",
              tier_slug: "foundation",
              title:
                "Coordination and control: maintaining a constant internal environment",
              unit_options: [],
              year: "11",
              cycle: "1",
              description: null,
              why_this_why_now: null,
              state: "published",
            },
            {
              connection_future_unit_description:
                "Pupils will learn about ways in which the human body maintains a constant internal environment in response to internal and external change, including changes in temperature and water balance.",
              connection_future_unit_title:
                "Coordination and control: maintaining a constant internal environment",
              connection_prior_unit_description:
                "Pupils learned about aerobic and anaerobic cellular respiration, including the chemical reactants and products of the processes, and practical ways to measure the rate of cellular respiration in living cells.",
              connection_prior_unit_title:
                "Aerobic and anaerobic cellular respiration",
              domain: null,
              domain_id: null,
              examboard: "AQA",
              examboard_slug: "aqa",
              keystage_slug: "ks4",
              lessons: [
                {
                  _state: "new",
                  slug: "a-model-of-diffusion-through-a-selectively-permeable-cell-membrane",
                  title:
                    "A model of diffusion through a selectively-permeable cell membrane ",
                },
                {
                  _state: "new",
                  slug: "plant-roots-are-adapted-to-absorb-water-and-mineral-ions",
                  title:
                    "Plant roots are adapted to absorb water and mineral ions",
                },
                {
                  _state: "new",
                  slug: "transport-systems-in-plants-xylem-and-phloem",
                  title: "Transport systems in plants: xylem and phloem",
                },
                {
                  _state: "new",
                  slug: "transport-systems-in-plants-translocation",
                  title: "Transport systems in plants: translocation",
                },
                {
                  _state: "new",
                  slug: "transport-systems-in-plants-transpiration",
                  title: "Transport systems in plants: transpiration",
                },
                {
                  _state: "new",
                  slug: "measuring-the-rate-of-water-uptake-by-a-plant",
                  title: "Measuring the rate of water uptake by a plant",
                },
                {
                  _state: "new",
                  slug: "the-effect-of-light-intensity-on-the-rate-of-water-uptake-by-a-plant",
                  title:
                    "The effect of light intensity on the rate of water uptake by a plant",
                },
                {
                  _state: "new",
                  slug: "the-importance-of-exchange-surfaces-and-transport-systems-in-plants",
                  title:
                    "The importance of exchange surfaces and transport systems in plants",
                },
              ],
              order: 7,
              phase: "Secondary",
              phase_slug: "secondary",
              planned_number_of_lessons: 12,
              slug: "transport-and-exchange-surfaces-in-plants",
              subject: "Combined science",
              subject_parent: "Science",
              subject_parent_slug: "science",
              subject_slug: "combined-science",
              tags: [],
              subjectcategories: [],
              threads: [
                {
                  order: 1,
                  slug: "bq01-biology-what-are-living-things-and-what-are-they-made-of",
                  title:
                    "BQ01 Biology: What are living things and what are they made of?",
                },
              ],
              tier: null,
              tier_slug: null,
              title: "Transport and exchange surfaces in plants",
              unit_options: [],
              year: "11",
              cycle: "1",
              description: null,
              why_this_why_now: null,
              state: "published",
            },
          ],
          groupAs: null,
          isSwimming: false,
        },
        "7": {
          childSubjects: [],
          subjectCategories: [
            {
              id: 5,
              slug: "biology",
              title: "Biology",
            },
          ],
          pathways: [],
          tiers: [],
          units: [
            {
              connection_future_unit_description:
                "Pupils will move on to construct and interpret pyramids of number and biomass from food chains data. Pupils will learn about how plants and animals are adapted to survive and the impact of changes to the environment on biodiversity. The importance of biodiversity and the importance of gene banks. How to sample plant and animal populations to aid our understanding and monitoring of populations. ",
              connection_future_unit_title: "Biodiversity",
              connection_prior_unit_description:
                "In Y4 pupils learnt about their local environment and to recognise that environments can change. Pupils also explored examples of human impact (both positive and negative) on environments. Pupils looked at a variety of food chains to identify producers, predators and prey.",
              connection_prior_unit_title: "More about food chains",
              domain: null,
              domain_id: null,
              examboard: null,
              examboard_slug: null,
              keystage_slug: "ks3",
              lessons: [
                {
                  _state: "published",
                  slug: "food-chains",
                  title: "Food chains",
                },
                {
                  _state: "published",
                  slug: "predator-prey-relationships",
                  title: "Predator-prey relationships",
                },
                {
                  _state: "published",
                  slug: "adaptations-of-predators-and-prey",
                  title: "Adaptations of predators and prey",
                },
                {
                  _state: "published",
                  slug: "food-webs",
                  title: "Food webs",
                },
                {
                  _state: "published",
                  slug: "ecosystems-and-habitats",
                  title: "Ecosystems and habitats",
                },
                {
                  _state: "published",
                  slug: "pollination-and-human-food-security",
                  title: "Pollination and human food security",
                },
                {
                  _state: "published",
                  slug: "using-chemicals-in-farming",
                  title: "Using chemicals in farming",
                },
                {
                  _state: "published",
                  slug: "bioaccumulation",
                  title: "Bioaccumulation",
                },
                {
                  _state: "published",
                  slug: "the-importance-of-biodiversity",
                  title: "The importance of biodiversity",
                },
              ],
              order: 6,
              phase: "Secondary",
              phase_slug: "secondary",
              planned_number_of_lessons: 9,
              slug: "ecosystems",
              subject: "Science",
              subject_parent: null,
              subject_parent_slug: null,
              subject_slug: "science",
              tags: [
                {
                  category: "Discipline",
                  id: 5,
                  title: "Biology",
                },
              ],
              subjectcategories: [{ id: 5, slug: "biology", title: "Biology" }],
              threads: [
                {
                  order: 3,
                  slug: "bq03-biology-how-do-living-things-live-together-in-their-environments",
                  title:
                    "BQ03 Biology: How do living things live together in their environments?",
                },
              ],
              tier: null,
              tier_slug: null,
              title: "Ecosystems",
              unit_options: [],
              year: "7",
              cycle: "1",
              description: null,
              why_this_why_now: null,
              state: "published",
            },
          ],
          groupAs: null,
          isSwimming: false,
        },
      };
      expect(createUnitsListingByYear(unitData)).toEqual(unitListingByYear);
    });
  });

  describe("createInitialYearFilterSelection", () => {
    // it("Should return default year filter selection", async () => {
    //   const initialYearFilterSelection = {
    //     "7": {
    //       subject: null,
    //       subjectCategory: { id: -1, title: "All" },
    //       tier: null,
    //     },
    //     "10": {
    //       subject: {
    //         subject: "Combined science",
    //         subject_slug: "combined-science",
    //       },
    //       subjectCategory: { id: -1, title: "All" },
    //       tier: null,
    //     },
    //     "11": {
    //       subject: {
    //         subject: "Combined science",
    //         subject_slug: "combined-science",
    //       },
    //       subjectCategory: { id: -1, title: "All" },
    //       tier: { tier: "Foundation", tier_slug: "foundation" },
    //     },
    //   };
    //   const yearData = createUnitsListingByYear(unitData);
    //   expect(createInitialYearFilterSelection(yearData, null)).toEqual(
    //     initialYearFilterSelection,
    //   );
    // });
  });
});
