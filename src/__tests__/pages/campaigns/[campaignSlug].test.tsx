import { GetServerSidePropsContext } from "next";

import { getServerSideProps } from "@/pages/campaigns/[campaignSlug]";

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
});
