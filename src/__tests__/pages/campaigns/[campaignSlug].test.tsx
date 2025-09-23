import { screen } from "@testing-library/dom";

import CampaignSinglePage, {
  blockOrder,
  getStaticPaths,
  getStaticProps,
  sortCampaignBlocksByBlockType,
} from "@/pages/campaigns/[campaignSlug]";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import keyStagesFixture from "@/node-lib/curriculum-api-2023/fixtures/keyStages.fixture";
import mockCampaign from "@/fixtures/campaign/mockCampaign";
import { CampaignPage } from "@/node-lib/sanity-graphql/generated/sdk";

const campaignBySlug = jest.fn().mockResolvedValue(mockCampaign);
const keyStages = jest.fn().mockResolvedValue(keyStagesFixture());

jest.mock("@/node-lib/cms", () => ({
  __esModule: true,
  default: {
    campaignPageBySlug: (...args: []) => campaignBySlug(args),
    campaigns: () => [{ slug: "mythbusting" }],
  },
}));

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    keyStages: () => keyStages(),
  },
}));

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    identify: jest.fn(),
  }),
}));

jest.mock("@/node-lib/posthog/getPosthogId", () => ({
  __esModule: true,
  getPosthogIdFromCookie: jest.fn().mockReturnValue("test-posthog-id"),
}));

jest.mock("@/node-lib/posthog/getFeatureFlag", () => ({
  __esModule: true,
  getFeatureFlag: jest.fn().mockReturnValue(true),
}));

jest.mock("@/components/HooksAndUtils/sanityImageBuilder", () => ({
  imageBuilder: {
    image: jest.fn().mockReturnValue({ url: jest.fn() }),
    url: jest.fn().mockReturnValue("https://example.com/image.jpg"),
    width: jest.fn().mockReturnValue({
      auto: jest.fn().mockReturnValue({
        quality: jest.fn().mockReturnValue({ fit: jest.fn() }),
      }),
    }),
    height: jest.fn(),
    fit: jest.fn(),
    crop: jest.fn(),
  },
  getSanityRefId: jest.fn().mockReturnValue("image-ref-id"),
  getImageDimensions: jest.fn().mockReturnValue({ width: 800, height: 600 }),
}));

const render = renderWithProviders();

describe("Campaign page", () => {
  it("calls the correct endpoint with the correct args", async () => {
    await getStaticProps({
      params: {
        campaignSlug: "test-campaign",
      },
    });

    expect(campaignBySlug).toHaveBeenCalledWith([
      "test-campaign",
      {
        previewMode: false,
      },
    ]);
  });
  it("returns the page data", async () => {
    const res = await getStaticProps({
      params: {
        campaignSlug: "test-campaign",
      },
    });
    expect(res).toEqual({
      props: {
        campaign: mockCampaign,
        keyStages: keyStagesFixture(),
      },
    });
  });

  it("Should return the paths of all campaign pages", async () => {
    const pathsResult = await getStaticPaths();

    expect(pathsResult.paths).toEqual([
      { params: { campaignSlug: "mythbusting" } },
    ]);
  });

  it("renders a header component", () => {
    render(
      <CampaignSinglePage
        campaign={mockCampaign}
        keyStages={keyStagesFixture()}
      />,
    );
    const header = screen.getByTestId("campaign-header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Test Campaign Header");
    const keystageButton = screen.getByText("KS1");
    expect(keystageButton).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText(
      "Search by keyword or topic",
    );
    expect(searchInput).toBeInTheDocument();
  });
  it("renders a promo banner component", () => {
    render(
      <CampaignSinglePage
        campaign={mockCampaign}
        keyStages={keyStagesFixture()}
      />,
    );
    const promoBanner = screen.getByText("campaign-promo-heading-text");
    expect(promoBanner).toBeInTheDocument();
  });
  it("renders an intro component", () => {
    render(
      <CampaignSinglePage
        campaign={mockCampaign}
        keyStages={keyStagesFixture()}
      />,
    );
    const campaignIntro = screen.getByText("campaign-intro-body-text");
    expect(campaignIntro).toBeInTheDocument();
  });

  it("does not render a campaign promo banner when not supplied", () => {
    const campaignWithoutPromo = {
      ...mockCampaign,
      content: mockCampaign.content.filter(
        (item) => item.type !== "CampaignPromoBanner",
      ),
    };

    render(
      <CampaignSinglePage
        campaign={campaignWithoutPromo}
        keyStages={keyStagesFixture()}
      />,
    );

    const promoBanner = screen.queryByText("campaign-promo-heading-text");
    expect(promoBanner).not.toBeInTheDocument();
  });

  it("does not render a campaign intro when not supplied", () => {
    const campaignWithoutIntro = {
      ...mockCampaign,
      content: mockCampaign.content.filter(
        (item) => item.type !== "CampaignIntro",
      ),
    };

    render(
      <CampaignSinglePage
        campaign={campaignWithoutIntro}
        keyStages={keyStagesFixture()}
      />,
    );

    const campaignIntro = screen.queryByText("campaign-intro-body-text");
    expect(campaignIntro).not.toBeInTheDocument();
  });

  it("renders a video component when provided", () => {
    render(
      <CampaignSinglePage
        campaign={mockCampaign}
        keyStages={keyStagesFixture()}
      />,
    );
    const campaignVideo = screen.getByText("campaign-video-heading-text");
    expect(campaignVideo).toBeInTheDocument();
  });

  it("does not render a campaign video banner when not supplied", () => {
    const campaignWithoutPromo = {
      ...mockCampaign,
      content: mockCampaign.content.filter(
        (item) => item.type !== "CampaignVideoBanner",
      ),
    };

    render(
      <CampaignSinglePage
        campaign={campaignWithoutPromo}
        keyStages={keyStagesFixture()}
      />,
    );

    const videoBanner = screen.queryByText("campaign-video-heading-text");
    expect(videoBanner).not.toBeInTheDocument();
  });

  it("renders the correct SEO props", () => {
    const { seo } = renderWithSeo()(
      <CampaignSinglePage
        campaign={mockCampaign}
        keyStages={keyStagesFixture()}
      />,
    );

    expect(seo).toMatchObject({
      title: "Test Campaign SEO Title | NEXT_PUBLIC_SEO_APP_NAME",
      description: "Test Campaign SEO Description",
    });
  });

  it("renders a sign up component", () => {
    render(
      <CampaignSinglePage
        campaign={mockCampaign}
        keyStages={keyStagesFixture()}
      />,
    );
    const signUpHeading = screen.getByText("newsletter-sign-up-heading-text");
    const signUpCta = screen.getByText("newsletter-signup-cta-button");
    expect(signUpHeading).toBeInTheDocument();
    expect(signUpCta).toBeInTheDocument();
  });

  describe("utils: block sorting function", () => {
    it("sorts the mock content blocks correctly", () => {
      const blocks = mockCampaign.content;
      const sorted = sortCampaignBlocksByBlockType(
        blockOrder,
        blocks,
      ) as CampaignPage["content"];

      if (sorted) {
        expect(sorted[0]).toBe(blocks[0]);
        expect(sorted[1]).toBe(blocks[3]);
        expect(sorted[2]).toBe(blocks[2]);
        expect(sorted[3]).toBe(blocks[1]);
      }
    });
  });
});
