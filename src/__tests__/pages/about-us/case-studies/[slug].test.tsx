import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import CMSClient from "@/node-lib/cms";
import {
  OaksImpactCaseStudyPage,
  OaksImpactPage,
} from "@/common-lib/cms-types/aboutPages";
import { portableTextFromString } from "@/__tests__/__helpers__/cms";
import { getFallbackBlockingConfig } from "@/node-lib/isr";
import { mockPortableTextBlocks } from "@/fixtures/curriculum/programmeSequenceYearData.fixtures";
import AboutUsCaseStudy from "@/pages/about-us/case-studies/[slug]";

let mockShouldSkipInitialBuild = false;

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => jest.fn().mockResolvedValue(topNavFixture)(),
  },
}));

jest.mock("@/node-lib/isr", () => ({
  ...jest.requireActual("@/node-lib/isr"),
  get shouldSkipInitialBuild() {
    return mockShouldSkipInitialBuild;
  },
  getFallbackBlockingConfig: jest.fn(),
}));

jest.mock("@/node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;
const mockGetFallbackBlockingConfig = jest.mocked(getFallbackBlockingConfig);

function caseStudyFixture(slug: string) {
  return {
    image: {
      altText: "Test image alt text",
      asset: {
        _id: "test-image-asset-id",
        url: "https://example.com/test-image.jpg",
      },
    },
    slug: {
      current: slug,
    },
    textRaw: portableTextFromString("testing"),
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
    publishedAt: "2023-01-01",
  };
}

const writtenCaseStudy = {
  title: "Test",
  tag: "primary",
  summaryRaw: portableTextFromString("TEST_SUMMARY"),
  content: [
    {
      heading: "TEST_HEADING_1",
      anchorSlug: {
        current: "test-anchor-slug-1",
      },
      label: "TEST_LABEL_1",
      contentRaw: portableTextFromString("TEST_CONTENT_1"),
    },
    {
      heading: "TEST_HEADING_2",
      anchorSlug: {
        current: "test-anchor-slug-2",
      },
      label: "TEST_LABEL_2",
      contentRaw: portableTextFromString("TEST_CONTENT_2"),
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
    current: "test",
  },
  image: {
    altText: "Test image alt text",
    asset: {
      _id: "test-image-asset-id",
      url: "https://example.com/test-image.jpg",
    },
  },
  textRaw: portableTextFromString("TEST_TEXT_RAW"),
  publishedAt: "2026-09-30",
};

const mockPageData: OaksImpactCaseStudyPage = {
  caseStudiesSection: {
    caseStudies: [
      caseStudyFixture("test-slug-1"),
      caseStudyFixture("test-slug-2"),
      caseStudyFixture("test-slug-3"),
    ],
  },
};

const mockImpactPageData: OaksImpactPage = {
  header: {
    introText: "Oaks Impact intro",
    video: {
      title: "Oaks Impact video",
      video: {
        asset: {
          assetId: "123",
          playbackId: "123",
          thumbTime: null,
        },
      },
      transcript: [mockPortableTextBlocks[0]],
    },
    videoDescription: "Oaks Impact video description",
  },
  statsSection: {
    textBlock: {
      title: "Oaks Impact stats heading",
      bodyPortableText: [],
    },
    stats: [],
  },
  caseStudiesSection: mockPageData.caseStudiesSection,
  schoolQuotes: {
    heading: "Oaks Impact school quotes heading",
    cards: [],
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  mockShouldSkipInitialBuild = false;
  mockGetFallbackBlockingConfig.mockReturnValue({
    fallback: "blocking",
    paths: [],
  });
  mockCMSClient.oaksImpactCaseStudyPage.mockResolvedValue(mockPageData);
  mockCMSClient.oaksImpactPage.mockResolvedValue(mockImpactPageData);
});

describe("pages/about-us/case-studies/[slug].tsx", () => {
  it("renders title", async () => {
    const { container, getAllByRole } = renderWithProviders()(
      <AboutUsCaseStudy
        isCaseStudiesFeatEnabled={false}
        pageData={{
          caseStudy: mockPageData.caseStudiesSection.caseStudies[0]!,
          otherCaseStudies:
            mockPageData.caseStudiesSection.caseStudies.slice(1),
        }}
        topNav={topNavFixture}
      />,
    );

    expect(container).toMatchSnapshot();
    expect(getAllByRole("navigation")[1]).toHaveTextContent("Oak's impact");
    expect(getAllByRole("navigation")[1]).not.toHaveTextContent("Case studies");
  });

  it("renders correct breadcrumb when case studies feature flag is enabled", async () => {
    const { getAllByRole } = renderWithProviders()(
      <AboutUsCaseStudy
        isCaseStudiesFeatEnabled={true}
        pageData={{
          caseStudy: mockPageData.caseStudiesSection.caseStudies[0]!,
          otherCaseStudies:
            mockPageData.caseStudiesSection.caseStudies.slice(1),
        }}
        topNav={topNavFixture}
      />,
    );

    expect(getAllByRole("navigation")[1]).toHaveTextContent("Case studies");
    expect(getAllByRole("navigation")[1]).not.toHaveTextContent("Oak's impact");
  });

  it("renders written case study", async () => {
    const { container, getAllByRole } = renderWithProviders()(
      <AboutUsCaseStudy
        isCaseStudiesFeatEnabled={true}
        pageData={{
          caseStudy: writtenCaseStudy,
          otherCaseStudies:
            mockPageData.caseStudiesSection.caseStudies.slice(1),
        }}
        topNav={topNavFixture}
      />,
    );

    expect(container).toMatchSnapshot();
    expect(getAllByRole("navigation")[1]).toHaveTextContent("Case studies");
    expect(getAllByRole("navigation")[1]).not.toHaveTextContent("Oak's impact");
    expect(container).toHaveTextContent("TEST_TEXT_RAW");
    expect(container).toHaveTextContent("TEST_SUMMARY");
    expect(container).toHaveTextContent("TEST_PERSON_NAME");
    expect(container).toHaveTextContent("TEST_JOB_ROLE");
    expect(container).toHaveTextContent("TEST_INSTITUTION_NAME");

    expect(container).toHaveTextContent("TEST_HEADING_1");
    expect(container).toHaveTextContent("TEST_CONTENT_1");
    expect(container).toHaveTextContent("TEST_HEADING_2");
    expect(container).toHaveTextContent("TEST_CONTENT_2");
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
