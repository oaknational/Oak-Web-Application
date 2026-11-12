import { screen } from "@testing-library/dom";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import OaksImpact, {
  getStaticProps,
  OaksImpactPageProps,
} from "@/pages/about-us/oaks-impact";
import CMSClient from "@/node-lib/cms";
import { mockPortableTextBlocks } from "@/fixtures/curriculum/programmeSequenceYearData.fixtures";

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => jest.fn().mockResolvedValue(topNavFixture)(),
  },
}));

jest.mock("../../../node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const mockPageData: OaksImpactPageProps["pageData"] = {
  content: {
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
    schoolQuotes: {
      heading: "Oaks Impact school quotes heading",
      cards: [],
    },
  },
  caseStudies: [
    {
      video: {
        title: "Test 1",
      },
      slug: {
        current: "test-1",
      },
      image: {},
      title: "Test 1",
    },
    {
      video: {
        title: "Test 2",
      },
      slug: {
        current: "test-2",
      },
      image: {},
      title: "Test 2",
    },
    {
      video: {
        title: "Test 3",
      },
      slug: {
        current: "test-3",
      },
      image: {},
      title: "Test 3",
    },
  ],
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
