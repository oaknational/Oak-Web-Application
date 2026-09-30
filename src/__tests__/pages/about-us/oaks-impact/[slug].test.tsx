import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import OaksImpact, {
  getStaticPaths,
  getStaticProps,
} from "@/pages/about-us/case-studies/[slug]";
import CMSClient from "@/node-lib/cms";
import {
  OaksImpactCaseStudyPage,
  OaksImpactPage,
} from "@/common-lib/cms-types/aboutPages";
import { portableTextFromString } from "@/__tests__/__helpers__/cms";
import { getFallbackBlockingConfig } from "@/node-lib/isr";
import { mockPortableTextBlocks } from "@/fixtures/curriculum/programmeSequenceYearData.fixtures";

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

describe("pages/about-us/oaks-impact/case-studies/[slug].tsx", () => {
  it("renders title", async () => {
    const { container } = renderWithProviders()(
      <OaksImpact
        pageData={{
          caseStudy: mockPageData.caseStudiesSection.caseStudies[0]!,
          otherCaseStudies:
            mockPageData.caseStudiesSection.caseStudies.slice(1),
        }}
        topNav={topNavFixture}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  describe("getStaticProps", () => {
    it("returns props data", async () => {
      const propsResult = await getStaticProps({
        params: { slug: "test-slug-1" },
      });

      expect(propsResult).toMatchObject({
        props: {
          topNav: topNavFixture,
        },
      });
    });

    it("returns notFound when the slug is missing", async () => {
      const propsResult = await getStaticProps({});

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });

    it("returns notFound when CMS returns null", async () => {
      mockCMSClient.oaksImpactCaseStudyPage.mockResolvedValueOnce(null);

      const propsResult = await getStaticProps({
        params: { slug: "test-slug-1" },
      });

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });

  describe("getStaticPaths", () => {
    it("returns the paths of all case studies", async () => {
      const pathsResult = await getStaticPaths();

      expect(pathsResult).toEqual({
        fallback: "blocking",
        paths: [
          { params: { slug: "test-slug-1" } },
          { params: { slug: "test-slug-2" } },
          { params: { slug: "test-slug-3" } },
        ],
      });
    });

    it("returns the fallback blocking config when initial build is skipped", async () => {
      mockShouldSkipInitialBuild = true;

      const pathsResult = await getStaticPaths();

      expect(mockGetFallbackBlockingConfig).toHaveBeenCalled();
      expect(pathsResult).toEqual({
        fallback: "blocking",
        paths: [],
      });
    });
  });
});
