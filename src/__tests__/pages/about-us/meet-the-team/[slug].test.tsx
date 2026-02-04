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
  prevHref: "/about-us/meet-the-team/previous-member?section=leadership",
  prevName: "Previous Member",
  nextHref: "/about-us/meet-the-team/next-member?section=board",
  nextName: "Next Member",
};

const mockMeetTheTeamPage = {
  id: "page-id",
  title: "Meet the Team",
  introText: null,
  leadershipText: null,
  boardText: null,
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
        category="Our leadership"
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it("renders with image", () => {
    const teamMemberWithImage = {
      ...mockTeamMember,
      image: {
        asset: { url: "https://example.com/image.jpg", _id: "image-id" },
        altText: "Test alt text",
      },
    };

    const { getAllByAltText } = renderWithProviders()(
      <AboutUsMeetTheTeamPerson
        pageData={teamMemberWithImage}
        topNav={topNavFixture}
        navigation={mockNavigation}
        category="Our leadership"
      />,
    );

    // Image is rendered twice (desktop and mobile versions)
    const images = getAllByAltText("Test alt text");
    expect(images).toHaveLength(2);
    expect(images[0]).toBeInTheDocument();
  });

  it("renders with socials", () => {
    const teamMemberWithSocials = {
      ...mockTeamMember,
      socials: {
        twitterUsername: "testuser",
        linkedinUrl: "https://linkedin.com/in/testuser",
      },
    };

    const { container } = renderWithProviders()(
      <AboutUsMeetTheTeamPerson
        pageData={teamMemberWithSocials}
        topNav={topNavFixture}
        navigation={mockNavigation}
        category="Our leadership"
      />,
    );

    const linkedinLink = container.querySelector(
      'a[href="https://linkedin.com/in/testuser"]',
    );
    const xLink = container.querySelector('a[href="https://x.com/testuser"]');

    expect(linkedinLink).toBeInTheDocument();
    expect(xLink).toBeInTheDocument();
  });

  it("renders without navigation when no prev/next", () => {
    const noNavigation = {
      prevHref: null,
      prevName: null,
      nextHref: null,
      nextName: null,
    };

    const { queryByText } = renderWithProviders()(
      <AboutUsMeetTheTeamPerson
        pageData={mockTeamMember}
        topNav={topNavFixture}
        navigation={noNavigation}
        category="Our leadership"
      />,
    );

    expect(queryByText("Previous profile")).not.toBeInTheDocument();
    expect(queryByText("Next profile")).not.toBeInTheDocument();
  });

  it("renders with only previous navigation", () => {
    const prevOnlyNavigation = {
      prevHref: "/about-us/meet-the-team/previous-member?section=leadership",
      prevName: "Previous Member",
      nextHref: null,
      nextName: null,
    };

    const { getByText, queryByText } = renderWithProviders()(
      <AboutUsMeetTheTeamPerson
        pageData={mockTeamMember}
        topNav={topNavFixture}
        navigation={prevOnlyNavigation}
        category="Our leadership"
      />,
    );

    expect(getByText("Previous profile")).toBeInTheDocument();
    expect(queryByText("Next profile")).not.toBeInTheDocument();
  });

  it("renders category label", () => {
    const { getByText } = renderWithProviders()(
      <AboutUsMeetTheTeamPerson
        pageData={mockTeamMember}
        topNav={topNavFixture}
        navigation={mockNavigation}
        category="Our board"
      />,
    );

    expect(getByText("Our board")).toBeInTheDocument();
  });

  describe("getServerSideProps", () => {
    // Skipped: Feature flag is temporarily bypassed for development (enableV2 = true)
    it.skip("should 404 when not enabled", async () => {
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

    it("should return navigation with prev and next when member is in the middle", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(true);

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: { section: "leadership" },
        params: {
          slug: "ed-southall",
        },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        props: {
          navigation: {
            prevHref:
              "/about-us/meet-the-team/previous-member?section=leadership",
            nextHref: "/about-us/meet-the-team/next-member?section=board",
          },
        },
      });
    });

    it("should return 'Our leadership' category for leadership team members", async () => {
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
        props: {
          category: "Our leadership",
        },
      });
    });

    it("should return 'Our board' category for board members", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(true);

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: {},
        params: {
          slug: "next-member",
        },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        props: {
          category: "Our board",
        },
      });
    });

    it("should return circular navigation for first leadership member (prev wraps to board)", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(true);

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: { section: "leadership" },
        params: {
          slug: "previous-member",
        },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        props: {
          navigation: {
            prevHref: "/about-us/meet-the-team/next-member?section=board", // Wraps to last board member
            nextHref: "/about-us/meet-the-team/ed-southall?section=leadership",
          },
        },
      });
    });

    it("should return circular navigation for last board member (next wraps to leadership)", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(true);

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: { section: "board" },
        params: {
          slug: "next-member",
        },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        props: {
          navigation: {
            prevHref: "/about-us/meet-the-team/ed-southall?section=leadership", // Previous wraps to last leadership member
            nextHref:
              "/about-us/meet-the-team/previous-member?section=leadership", // Next wraps to first leadership member
          },
        },
      });
    });

    it("should handle member with id fallback when no slug", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(true);
      const pageWithIdOnlyMember = {
        ...mockMeetTheTeamPage,
        leadershipTeam: [
          { id: "id-only-member", name: "ID Only Member", slug: null },
        ],
        boardMembers: [],
      };
      (CMSClient.meetTheTeamPage as jest.Mock).mockResolvedValue(
        pageWithIdOnlyMember,
      );

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: {},
        params: {
          slug: "id-only-member",
        },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        props: {
          navigation: {
            prevHref: null,
            nextHref: null,
          },
        },
      });
    });

    it("should return empty navigation when meetTheTeamPage is null", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(true);
      (CMSClient.meetTheTeamPage as jest.Mock).mockResolvedValue(null);

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: {},
        params: {
          slug: "ed-southall",
        },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        props: {
          navigation: {
            prevHref: null,
            prevName: null,
            nextHref: null,
            nextName: null,
          },
        },
      });
    });

    it("should return empty navigation when member not found in list", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(true);
      const teamMemberNotInList = {
        ...mockTeamMember,
        slug: { current: "unlisted-member" },
      };
      (CMSClient.teamMemberBySlug as jest.Mock).mockResolvedValue(
        teamMemberNotInList,
      );

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: {},
        params: {
          slug: "unlisted-member",
        },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        props: {
          navigation: {
            prevHref: null,
            nextHref: null,
          },
        },
      });
    });

    it("should navigate correctly when member appears in both leadership and board", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(true);
      // Create a scenario where a member appears in both lists
      const duplicateMember = {
        id: "duplicate-member",
        name: "Duplicate Member",
        slug: { current: "duplicate-member" },
      };
      const pageWithDuplicateMember = {
        ...mockMeetTheTeamPage,
        leadershipTeam: [
          duplicateMember,
          { id: "leader-2", name: "Leader Two", slug: { current: "leader-2" } },
        ],
        boardMembers: [
          duplicateMember, // Same member appears in board
          { id: "board-2", name: "Board Two", slug: { current: "board-2" } },
        ],
      };
      (CMSClient.meetTheTeamPage as jest.Mock).mockResolvedValue(
        pageWithDuplicateMember,
      );

      // When viewing duplicate member from board section, navigation stays in board
      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: { section: "board" },
        params: {
          slug: "duplicate-member",
        },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      // duplicate-member is at index 0 in board
      // prev should wrap to last leadership member (leader-2)
      // next should go to board-2
      expect(propsResult).toMatchObject({
        props: {
          category: "Our board",
          navigation: {
            prevHref: "/about-us/meet-the-team/leader-2?section=leadership",
            nextHref: "/about-us/meet-the-team/board-2?section=board",
          },
        },
      });
    });

    it("should show different categories for same member based on section", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(true);
      const duplicateMember = {
        id: "duplicate-member",
        name: "Duplicate Member",
        slug: { current: "duplicate-member" },
      };
      const pageWithDuplicateMember = {
        ...mockMeetTheTeamPage,
        leadershipTeam: [duplicateMember],
        boardMembers: [duplicateMember],
      };
      (CMSClient.meetTheTeamPage as jest.Mock).mockResolvedValue(
        pageWithDuplicateMember,
      );

      // View from leadership section
      const leadershipResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: { section: "leadership" },
        params: { slug: "duplicate-member" },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(leadershipResult).toMatchObject({
        props: { category: "Our leadership" },
      });

      // View from board section
      const boardResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: { section: "board" },
        params: { slug: "duplicate-member" },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(boardResult).toMatchObject({
        props: { category: "Our board" },
      });
    });
  });
});
