import { screen } from "@testing-library/dom";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import OaksImpact, { getStaticProps } from "@/pages/about-us/oaks-impact";
import CMSClient from "@/node-lib/cms";
import { OaksImpactPage } from "@/common-lib/cms-types/aboutPages";
import { mockPortableTextBlocks } from "@/fixtures/curriculum/programmeSequenceYearData.fixtures";

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => jest.fn().mockResolvedValue(topNavFixture)(),
  },
}));

jest.mock("../../../node-lib/cms");

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
  caseStudiesSection: {
    caseStudies: [],
  },
  schoolQuotes: {
    heading: "Oaks Impact school quotes heading",
    cards: [],
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  mockCMSClient.oaksImpactPage.mockResolvedValue(mockPageData);
});

describe("pages/about-us/oaks-impact.tsx", () => {
  it("renders title", async () => {
    const { container } = renderWithProviders()(
      <OaksImpact pageData={mockPageData} topNav={topNavFixture} />,
    );

    const heading = await screen.findByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  describe("getStaticProps", () => {
    it("should return props data", async () => {
      const propsResult = await getStaticProps({});

      expect(propsResult).toMatchObject({
        props: {
          topNav: topNavFixture,
        },
      });
    });

    it("should return notFound when CMS returns null", async () => {
      mockCMSClient.oaksImpactPage.mockResolvedValueOnce(null);

      const propsResult = await getStaticProps({});

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
