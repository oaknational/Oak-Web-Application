import { GetServerSidePropsContext } from "next/dist/types";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import CMSClient from "@/node-lib/cms";
import { portableTextFromString } from "@/__tests__/__helpers__/cms";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";
import { mockPortableTextBlocks } from "@/fixtures/curriculum/programmeSequenceYearData.fixtures";
import AboutUsCaseStudy, {
  getServerSideProps,
} from "@/pages/about-us/case-studies/[slug]";

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => jest.fn().mockResolvedValue(topNavFixture)(),
  },
}));

jest.mock("@/utils/featureFlagChecks/server", () => ({
  isFeatureFlagEnabledServer: jest.fn(),
}));

jest.mock("@/node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;
const mockIsFeatureFlagEnabledServer = jest.mocked(isFeatureFlagEnabledServer);

function caseStudyFixture(number: number) {
  return {
    title: `TEST_TITLE_${number}`,
    tag: "primary",
    summaryRaw: portableTextFromString(`TEST_SUMMARY_${number}`),
    content: [
      {
        heading: "TEST_HEADING_1",
        label: "TEST_LABEL_1",
        anchorSlug: {
          current: "test-anchor-slug-1",
        },
        contentRaw: portableTextFromString("TEST_CONTENT_1"),
      },
      {
        heading: "TEST_HEADING_2",
        label: "TEST_LABEL_2",
        anchorSlug: {
          current: "test-anchor-slug-2",
        },
        contentRaw: [
          ...portableTextFromString("Text alongside media"),
          {
            _key: "embedded-image",
            _type: "imageWithAltText",
            altText: "A classroom using Oak",
            isPresentational: false,
            asset: {
              _id: "image-d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320-png",
              url: "https://cdn.sanity.io/images/cuvjke51/production/d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320.png",
            },
          },
          {
            _key: "embedded-video",
            _type: "video",
            title: "Embedded case study video",
            video: {
              asset: {
                assetId: "embedded-asset-id",
                playbackId: "embedded-playback-id",
                thumbTime: null,
              },
            },
            transcript: portableTextFromString("Embedded video transcript"),
          },
        ],
      },
    ],
    showGetInTouchPanel: true,
    getInTouchPanel: {
      personName: "TEST_PERSON_NAME",
      personImage: {
        altText: null,
        isPresentational: true,
        asset: {
          _id: "image-d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320-png",
          url: "https://cdn.sanity.io/images/cuvjke51/production/d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320.png",
        },
        hotspot: null,
      },
      jobRole: "TEST_JOB_ROLE",
      institutionName: "TEST_INSTITUTION_NAME",
    },
    video: {
      title: "Test Video",
      video: {
        asset: {
          assetId: "test-asset-id",
          playbackId: "test-playback-id",
          thumbTime: null,
        },
      },
      transcript: [mockPortableTextBlocks[0]],
    },
    slug: {
      current: `test-${number}`,
    },
    image: {
      altText: "Test image alt text",
      isPresentational: false,
      asset: {
        _id: "test-image-asset-id",
        url: "https://example.com/test-image.jpg",
      },
      hotspot: null,
    },
    textRaw: portableTextFromString("TEST_TEXT_RAW"),
    publishedAt: `2026-01-30`,
  };
}

const caseStudy = caseStudyFixture(1);

const videoCaseStudy = {
  ...caseStudy,
  title: "TEST_TITLE_VIDEO",
  slug: {
    current: `test-video`,
  },
  tag: null,
  summaryRaw: null,
  content: null,
  showGetInTouchPanel: false,
  getInTouchPanel: null,
};

const otherCaseStudies = [
  caseStudyFixture(2),
  caseStudyFixture(3),
  videoCaseStudy,
];

beforeEach(() => {
  jest.clearAllMocks();
  mockIsFeatureFlagEnabledServer.mockResolvedValue(true);
  mockCMSClient.caseStudyPage.mockResolvedValue(caseStudy);
  mockCMSClient.caseStudyLibraryPage.mockResolvedValue(otherCaseStudies);
});

describe("pages/about-us/case-studies/[slug].tsx", () => {
  it("renders a case study with written content and embedded media correctly", async () => {
    const { container, getByRole } = renderWithProviders()(
      <AboutUsCaseStudy
        isCaseStudiesFeatEnabled={true}
        pageData={{ caseStudy, otherCaseStudies: [] }}
        topNav={topNavFixture}
      />,
    );

    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent("TEST_TITLE_1");
    expect(container).toHaveTextContent("TEST_TEXT_RAW");
    expect(container).toHaveTextContent("TEST_SUMMARY_1");
    expect(container).toHaveTextContent("TEST_PERSON_NAME");
    expect(container).toHaveTextContent("TEST_JOB_ROLE");
    expect(container).toHaveTextContent("TEST_INSTITUTION_NAME");

    expect(container).toHaveTextContent("TEST_HEADING_1");
    expect(container).toHaveTextContent("TEST_CONTENT_1");
    expect(container).toHaveTextContent("TEST_HEADING_2");
    expect(container).toHaveTextContent("Text alongside media");
    expect(
      getByRole("img", { name: "A classroom using Oak" }),
    ).toBeInTheDocument();
    expect(container).toHaveTextContent("Embedded video transcript");
  });

  it("renders a case study with video only correctly", async () => {
    const { container } = renderWithProviders()(
      <AboutUsCaseStudy
        isCaseStudiesFeatEnabled={true}
        pageData={{ caseStudy: videoCaseStudy, otherCaseStudies: [] }}
        topNav={topNavFixture}
      />,
    );

    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent("TEST_TITLE_VIDEO");
  });

  it("renders correct breadcrumb when case studies feature flag is enabled", async () => {
    const { getAllByRole } = renderWithProviders()(
      <AboutUsCaseStudy
        isCaseStudiesFeatEnabled={true}
        pageData={{ caseStudy, otherCaseStudies: [] }}
        topNav={topNavFixture}
      />,
    );

    expect(getAllByRole("navigation")[1]).toHaveTextContent("Case studies");
    expect(getAllByRole("navigation")[1]).not.toHaveTextContent("Oak's impact");
  });

  it("renders the other case studies", async () => {
    const { container, getAllByRole } = renderWithProviders()(
      <AboutUsCaseStudy
        isCaseStudiesFeatEnabled={true}
        pageData={{ caseStudy, otherCaseStudies }}
        topNav={topNavFixture}
      />,
    );

    const otherCaseStudiesLinks = getAllByRole("link", {
      name: /TEST_TITLE_/,
    }).map((link) => link.getAttribute("href"));

    expect(container).toMatchSnapshot();
    expect(otherCaseStudiesLinks).toEqual([
      "/about-us/case-studies/test-2",
      "/about-us/case-studies/test-3",
      "/about-us/case-studies/test-video",
    ]);
    expect(otherCaseStudiesLinks).toHaveLength(3);
  });

  it("does not render written case studies in other case studies section when feature flag is not enabled", async () => {
    const { container, getAllByRole } = renderWithProviders()(
      <AboutUsCaseStudy
        isCaseStudiesFeatEnabled={false}
        pageData={{ caseStudy, otherCaseStudies }}
        topNav={topNavFixture}
      />,
    );

    const otherCaseStudiesLinks = getAllByRole("link", {
      name: /TEST_TITLE_/,
    }).map((link) => link.getAttribute("href"));

    expect(container).toMatchSnapshot();
    expect(otherCaseStudiesLinks).toEqual([
      "/about-us/case-studies/test-video",
    ]);
    expect(otherCaseStudiesLinks).not.toContain(
      "/about-us/case-studies/test-2",
    );
    expect(otherCaseStudiesLinks).toHaveLength(1);
  });

  describe("getServerSideProps", () => {
    it("returns notFound when the slug is missing", async () => {
      const propsResult = await getServerSideProps({
        req: {
          cookies: {},
        },
      } as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });

    it("returns notFound when CMS returns null", async () => {
      mockCMSClient.caseStudyPage.mockResolvedValueOnce(null);

      const propsResult = await getServerSideProps({
        req: {
          cookies: {},
        },
        params: { slug: "test-slug-1" },
      } as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });

  // describe("getStaticProps", () => {
  //   it("returns props data", async () => {
  //     const propsResult = await getStaticProps({
  //       params: { slug: "test-slug-1" },
  //     });

  //     expect(propsResult).toMatchObject({
  //       props: {
  //         topNav: topNavFixture,
  //       },
  //     });
  //   });

  //   it("returns notFound when the slug is missing", async () => {
  //     const propsResult = await getStaticProps({});

  //     expect(propsResult).toMatchObject({
  //       notFound: true,
  //     });
  //   });

  //   it("returns notFound when CMS returns null", async () => {
  //     mockCMSClient.oaksImpactCaseStudyPage.mockResolvedValueOnce(null);

  //     const propsResult = await getStaticProps({
  //       params: { slug: "test-slug-1" },
  //     });

  //     expect(propsResult).toMatchObject({
  //       notFound: true,
  //     });
  //   });
  // });

  // describe("getStaticPaths", () => {
  //   it("returns the paths of all case studies", async () => {
  //     const pathsResult = await getStaticPaths();

  //     expect(pathsResult).toEqual({
  //       fallback: "blocking",
  //       paths: [
  //         { params: { slug: "test-slug-1" } },
  //         { params: { slug: "test-slug-2" } },
  //         { params: { slug: "test-slug-3" } },
  //       ],
  //     });
  //   });

  //   it("returns the fallback blocking config when initial build is skipped", async () => {
  //     mockShouldSkipInitialBuild = true;

  //     const pathsResult = await getStaticPaths();

  //     expect(mockGetFallbackBlockingConfig).toHaveBeenCalled();
  //     expect(pathsResult).toEqual({
  //       fallback: "blocking",
  //       paths: [],
  //     });
  //   });
  // });
});
