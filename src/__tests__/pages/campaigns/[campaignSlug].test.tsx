import { GetServerSidePropsContext } from "next";

import CampaignSinglePage, {
  getServerSideProps,
} from "@/pages/campaigns/[campaignSlug]";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";

const campaignBySlug = jest.fn().mockResolvedValue({
  title: "Test Campaign",
  slug: "test-campaign",
  header: {
    title: "Test Campaign Header",
    image: {},
  },
  content: [
    {
      type: "CampaignIntro",
      headingPortableTextWithPromo: [],
    },
  ],
});

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
        campaign: {
          content: [
            {
              headingPortableTextWithPromo: [],
              type: "CampaignIntro",
            },
          ],
          header: {
            image: {},
            title: "Test Campaign Header",
          },
          slug: "test-campaign",
          title: "Test Campaign",
        },
      },
    });
  });
  it("renders the correct SEO props", () => {
    const { seo } = renderWithSeo()(
      <CampaignSinglePage
        campaign={{
          id: "test-campaign-id",
          title: "Test Campaign",
          slug: "test-campaign",
          header: {
            heading: "Heading",
            image: {},
          },
          content: [],
          seo: {
            title: "Test Campaign SEO Title",
            description: "Test Campaign SEO Description",
          },
        }}
      />,
    );

    expect(seo).toMatchObject({
      title: "Test Campaign SEO Title | NEXT_PUBLIC_SEO_APP_NAME",
      description: "Test Campaign SEO Description",
    });
  });
});
