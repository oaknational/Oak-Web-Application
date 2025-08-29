import { GetServerSidePropsContext } from "next";
import { screen } from "@testing-library/dom";

import CampaignSinglePage, {
  getServerSideProps,
} from "@/pages/campaigns/[campaignSlug]";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { CampaignPage } from "@/common-lib/cms-types/campaignPage";
import { mockImageAsset } from "@/__tests__/__helpers__/cms";
import keyStagesFixture from "@/node-lib/curriculum-api-2023/fixtures/keyStages.fixture";
import {
  bodyPortableText,
  headingPortableText,
} from "@/fixtures/campaign/portableText";

const mockCampaign: CampaignPage = {
  id: "test-id",
  content: [
    {
      headingPortableTextWithPromo: [],
      type: "CampaignIntro",
      bodyPortableTextWithPromo: bodyPortableText("campaign-intro-body-text"),
    },
    {
      headingPortableTextWithPromo: headingPortableText(
        "campaign-promo-heading-text",
      ),
      type: "CampaignPromoBanner",
      media: [{ ...mockImageAsset(), altText: "campaign-promo-test" }],
    },
  ],
  header: {
    image: { ...mockImageAsset(), altText: "Test Image Alt Text" },
    heading: "Test Campaign Header",
  },
  slug: "test-campaign",
  title: "Test Campaign",
  seo: {
    title: "Test Campaign SEO Title",
    description: "Test Campaign SEO Description",
  },
};

const campaignBySlug = jest.fn().mockResolvedValue(mockCampaign);
const keyStages = jest.fn().mockResolvedValue(keyStagesFixture());

jest.mock("@/node-lib/cms", () => ({
  __esModule: true,
  default: {
    campaignPageBySlug: (...args: []) => campaignBySlug(args),
  },
}));

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    keyStages: () => keyStages(),
  },
}));

jest.mock("@/node-lib/posthog/getPosthogId", () => ({
  __esModule: true,
  getPosthogIdFromCookie: jest.fn().mockReturnValue("test-posthog-id"),
}));

jest.mock("@/node-lib/posthog/getFeatureFlag", () => ({
  __esModule: true,
  getFeatureFlag: jest.fn().mockReturnValue(true),
}));

const getContext = (overrides: Partial<GetServerSidePropsContext>) =>
  ({
    req: {},
    res: {},
    query: {},
    params: { campaignSlug: "test-campaign" },
    ...overrides,
  }) as unknown as GetServerSidePropsContext<{
    campaignSlug: string;
  }>;

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
    await getServerSideProps(getContext({}));

    expect(campaignBySlug).toHaveBeenCalledWith([
      "test-campaign",
      {
        previewMode: false,
      },
    ]);
  });
  it("returns the page data", async () => {
    const res = await getServerSideProps(getContext({}));
    expect(res).toEqual({
      props: {
        campaign: mockCampaign,
        keyStages: keyStagesFixture(),
      },
    });
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
});
