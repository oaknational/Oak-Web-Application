import { screen } from "@testing-library/dom";
import { GetServerSidePropsContext } from "next";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import OaksImpact, { getServerSideProps } from "@/pages/about-us/oaks-impact";
import CMSClient from "@/node-lib/cms";
import { OaksImpactPage } from "@/common-lib/cms-types/aboutPages";

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

jest.mock("../../../node-lib/cms");

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  mockCMSClient.oaksImpactPage.mockResolvedValue(mockPageData);
});

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const mockPageData: OaksImpactPage = {
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
      captions: ["Oaks Impact captions"],
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
  caseStudiesSection: {
    caseStudies: [],
  },
  schoolQuotes: {
    heading: "Oaks Impact school quotes heading",
    cards: [],
  },
};

describe("pages/about-us/oaks-impact.tsx", () => {
  it("renders title when feature flag is enabled", async () => {
    mockGetFeatureFlag.mockResolvedValue(true);

    const { container } = renderWithProviders()(
      <OaksImpact pageData={mockPageData} topNav={topNavFixture} />,
    );

    const heading = await screen.findByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  describe("getServerSideProps", () => {
    it("should return props data when feature flag is enabled", async () => {
      mockGetFeatureFlag.mockResolvedValue(true);

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
      } as GetServerSidePropsContext);

      expect(propsResult).toMatchObject({
        props: {
          topNav: topNavFixture,
        },
      });
    });

    it("should return not found when feature flag is disabled", async () => {
      mockGetFeatureFlag.mockResolvedValue(false);

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
      } as GetServerSidePropsContext);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });

    it("should return notFound when CMS returns null", async () => {
      mockCMSClient.oaksImpactPage.mockResolvedValueOnce(null);

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
      } as GetServerSidePropsContext);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
