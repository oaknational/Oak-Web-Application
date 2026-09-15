import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import AboutUsCaseStudy, {
  getStaticPaths,
  getStaticProps,
} from "@/pages/about-us/case-studies/[slug]";
import CMSClient from "@/node-lib/cms";
import { CaseStudyListPage } from "@/common-lib/cms-types/aboutPages";
import { portableTextFromString } from "@/__tests__/__helpers__/cms";
import { getFallbackBlockingConfig } from "@/node-lib/isr";

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
      captions: ["Test captions"],
    },
    publishedAt: "2023-01-01",
  };
}

const mockPageData: CaseStudyListPage = [
  caseStudyFixture("test-slug-1"),
  caseStudyFixture("test-slug-2"),
  caseStudyFixture("test-slug-3"),
];

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  mockShouldSkipInitialBuild = false;
  mockGetFallbackBlockingConfig.mockReturnValue({
    fallback: "blocking",
    paths: [],
  });
  mockCMSClient.caseStudyListPage.mockResolvedValue(mockPageData);
});

describe("pages/about-us/case-studies/[slug].tsx", () => {
  it("renders title", async () => {
    const { container } = renderWithProviders()(
      <AboutUsCaseStudy
        pageData={{
          caseStudy: mockPageData[0]!,
          otherCaseStudies: mockPageData.slice(1),
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
      mockCMSClient.caseStudyListPage.mockResolvedValueOnce([]);

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
