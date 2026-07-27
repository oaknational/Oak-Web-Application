import { GetServerSidePropsContext } from "next";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import OaksImpact, {
  getServerSideProps,
} from "@/pages/about-us/oaks-impact/case-studies/[slug]";
import CMSClient from "@/node-lib/cms";
import { OaksImpactCaseStudyPage } from "@/common-lib/cms-types/aboutPages";
import { portableTextFromString } from "@/__tests__/__helpers__/cms";

const mockGetFeatureFlag = jest.fn();

jest.mock("@/node-lib/posthog/getFeatureFlag", () => ({
  __esModule: true,
  getFeatureFlag: () => mockGetFeatureFlag(),
}));

jest.mock("@/node-lib/posthog/getPosthogId", () => ({
  __esModule: true,
  getPosthogIdFromCookie: jest.fn().mockReturnValue("test-id"),
}));

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => jest.fn().mockResolvedValue(topNavFixture)(),
  },
}));

jest.mock("@/node-lib/cms");

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  mockCMSClient.oaksImpactCaseStudyPage.mockResolvedValue(mockPageData);
});

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const mockPageData: OaksImpactCaseStudyPage = {
  image: {
    altText: "Test image alt text",
    asset: {
      _id: "test-image-asset-id",
      url: "https://example.com/test-image.jpg",
    },
  },
  slug: {
    current: "test-slug",
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
};

describe("pages/about-us/oaks-impact/case-studies/[slug].tsx", () => {
  it("renders title when feature flag is enabled", async () => {
    mockGetFeatureFlag.mockResolvedValue(true);

    const { container } = renderWithProviders()(
      <OaksImpact pageData={mockPageData} topNav={topNavFixture} />,
    );

    expect(container).toMatchSnapshot();
  });

  describe("getServerSideProps", () => {
    it("should return props data when feature flag is enabled", async () => {
      mockGetFeatureFlag.mockResolvedValue(true);

      const propsResult = await getServerSideProps({
        params: { slug: "test-slug" },
        req: { cookies: {} },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        props: {
          topNav: topNavFixture,
        },
      });
    });

    it("should return not found when feature flag is disabled", async () => {
      mockGetFeatureFlag.mockResolvedValue(false);

      const propsResult = await getServerSideProps({
        params: { slug: "test-slug" },
        req: { cookies: {} },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });

    it("should return notFound when CMS returns null", async () => {
      mockCMSClient.oaksImpactPage.mockResolvedValueOnce(null);

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
