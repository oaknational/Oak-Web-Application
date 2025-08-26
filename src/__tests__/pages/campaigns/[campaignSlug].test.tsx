import { GetServerSidePropsContext } from "next";

import CampaignSinglePage, {
  getServerSideProps,
} from "@/pages/campaigns/[campaignSlug]";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { CampaignPage } from "@/common-lib/cms-types/campaignPage";
import { screen } from "@testing-library/dom";
import { mockImageAsset } from "@/__tests__/__helpers__/cms";

const mockCampaign: CampaignPage = {
  id: "test-id",
  content: [
    {
      headingPortableTextWithPromo: [],
      type: "CampaignIntro",
      bodyPortableTextWithPromo: [],
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

jest.mock("@/node-lib/cms", () => ({
  __esModule: true,
  default: {
    campaignPageBySlug: (...args: []) => campaignBySlug(args),
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
      },
    });
  });
  it("renders a header", () => {
    render(<CampaignSinglePage campaign={mockCampaign} />);
    const header = screen.getByTestId("campaign-header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Test Campaign Header");
  });
  it("renders the correct SEO props", () => {
    const { seo } = renderWithSeo()(
      <CampaignSinglePage campaign={mockCampaign} />,
    );

    expect(seo).toMatchObject({
      title: "Test Campaign SEO Title | NEXT_PUBLIC_SEO_APP_NAME",
      description: "Test Campaign SEO Description",
    });
  });
});
