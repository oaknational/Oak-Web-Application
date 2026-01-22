import { GetServerSidePropsContext } from "next";
import "jest-styled-components";

import renderWithProviders from "../../../__helpers__/renderWithProviders";

import AboutUsMeetTheTeamPerson, {
  AboutUsMeetTheTeamPersonPageProps,
  getServerSideProps,
} from "@/pages/about-us/meet-the-team/[slug]";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import CMSClient from "@/node-lib/cms";

jest.mock("@/node-lib/posthog/getFeatureFlag");
jest.mock("../../../../node-lib/cms");
jest.mock("@/node-lib/posthog/getPosthogId", () => ({
  __esModule: true,
  getPosthogIdFromCookie: jest.fn().mockReturnValue("test-posthog-id"),
}));

const mockTeamMember: AboutUsMeetTheTeamPersonPageProps["pageData"] = {
  id: "test-id",
  name: "Ed Southall",
  role: "Subject Lead (maths)",
  slug: { current: "ed-southall" },
  image: null,
  bioPortableText: [
    {
      _type: "block",
      children: [{ _type: "span", text: "Test bio text" }],
    },
  ],
  socials: null,
  hotspot: null,
};

const mockNavigation: AboutUsMeetTheTeamPersonPageProps["navigation"] = {
  prevSlug: "previous-member",
  prevName: "Previous Member",
  nextSlug: "next-member",
  nextName: "Next Member",
};

const mockMeetTheTeamPage = {
  id: "page-id",
  title: "Meet the Team",
  leadershipTeam: [
    {
      id: "prev-id",
      name: "Previous Member",
      slug: { current: "previous-member" },
    },
    mockTeamMember,
  ],
  boardMembers: [
    { id: "next-id", name: "Next Member", slug: { current: "next-member" } },
  ],
  documents: null,
  governancePortableText: [],
  seo: null,
};

describe("pages/about/meet-the-team/[slug].tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    (CMSClient.teamMemberBySlug as jest.Mock).mockResolvedValue(mockTeamMember);
    (CMSClient.meetTheTeamPage as jest.Mock).mockResolvedValue(
      mockMeetTheTeamPage,
    );
  });

  it("renders", () => {
    const { container } = renderWithProviders()(
      <AboutUsMeetTheTeamPerson
        pageData={mockTeamMember}
        topNav={topNavFixture}
        navigation={mockNavigation}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  describe("getServerSideProps", () => {
    it("should 404 when not enabled", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(false);
      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: {},
        params: {
          slug: "test",
        },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });

    it("should 200 when enabled", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(true);
      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: {},
        params: {
          slug: "ed-southall",
        },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        props: expect.anything(),
      });
    });

    it("should 404 when slug is not provided", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(true);
      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: {},
        params: {},
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });

    it("should 404 when team member not found", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(true);
      (CMSClient.teamMemberBySlug as jest.Mock).mockResolvedValue(null);

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: {},
        params: {
          slug: "non-existent",
        },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
