import { GetServerSidePropsContext } from "next";
import "jest-styled-components";
import { fireEvent } from "@testing-library/react";
import mockRouter from "next-router-mock";

import renderWithProviders from "../../../__helpers__/renderWithProviders";

import AboutUsMeetTheTeamPerson, {
  AboutUsMeetTheTeamPersonPageProps,
  getServerSideProps,
} from "@/pages/about-us/meet-the-team/[slug]";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import CMSClient from "@/node-lib/cms";

jest.mock("../../../../node-lib/cms");

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

  describe("breadcrumb", () => {
    it("renders breadcrumb with Home, Meet the team, and member name", () => {
      const { getByLabelText } = renderWithProviders()(
        <AboutUsMeetTheTeamPerson
          pageData={mockTeamMember}
          topNav={topNavFixture}
          navigation={mockNavigation}
          category="Our leadership"
        />,
      );

      const breadcrumbNav = getByLabelText("Breadcrumb");
      expect(breadcrumbNav).toBeInTheDocument();
      expect(breadcrumbNav).toHaveTextContent("Home");
      expect(breadcrumbNav).toHaveTextContent("Meet the team");
      expect(breadcrumbNav).toHaveTextContent("Ed Southall");
    });

    it("renders Meet the team as a link to /about-us/meet-the-team", () => {
      const { getByLabelText } = renderWithProviders()(
        <AboutUsMeetTheTeamPerson
          pageData={mockTeamMember}
          topNav={topNavFixture}
          navigation={mockNavigation}
          category="Our leadership"
        />,
      );

      const breadcrumbNav = getByLabelText("Breadcrumb");
      const meetTheTeamLink = breadcrumbNav.querySelector(
        'a[href="/about-us/meet-the-team"]',
      );
      expect(meetTheTeamLink).toBeInTheDocument();
    });

    it("renders the current member name as non-linked text", () => {
      const { getByLabelText } = renderWithProviders()(
        <AboutUsMeetTheTeamPerson
          pageData={mockTeamMember}
          topNav={topNavFixture}
          navigation={mockNavigation}
          category="Our leadership"
        />,
      );

      const breadcrumbNav = getByLabelText("Breadcrumb");
      // The member name should be in the breadcrumb but not as a link
      const items = breadcrumbNav.querySelectorAll("li");
      const lastItem = items[items.length - 1];
      expect(lastItem).toHaveTextContent("Ed Southall");
      expect(lastItem?.querySelector("a")).toBeNull();
    });
  });

  describe("prev/next profile navigation uses router.replace", () => {
    let replaceSpy: jest.SpyInstance;

    beforeEach(() => {
      replaceSpy = jest.spyOn(mockRouter, "replace");
    });

    afterEach(() => {
      replaceSpy.mockRestore();
    });

    it("calls router.replace when clicking next profile", () => {
      const { getByText } = renderWithProviders()(
        <AboutUsMeetTheTeamPerson
          pageData={mockTeamMember}
          topNav={topNavFixture}
          navigation={mockNavigation}
          category="Our leadership"
        />,
      );

      const nextButton = getByText("Next profile").closest("a")!;
      fireEvent.click(nextButton);

      expect(replaceSpy).toHaveBeenCalledWith(mockNavigation.nextHref);
    });

    it("calls router.replace when clicking previous profile", () => {
      const { getByText } = renderWithProviders()(
        <AboutUsMeetTheTeamPerson
          pageData={mockTeamMember}
          topNav={topNavFixture}
          navigation={mockNavigation}
          category="Our leadership"
        />,
      );

      const prevButton = getByText("Previous profile").closest("a")!;
      fireEvent.click(prevButton);

      expect(replaceSpy).toHaveBeenCalledWith(mockNavigation.prevHref);
    });
  });

  describe("getServerSideProps", () => {
    it("should 404 when slug is not provided", async () => {
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

    it("should wrap within board only when leadership is empty", async () => {
      const pageWithBoardOnly = {
        ...mockMeetTheTeamPage,
        leadershipTeam: [],
        boardMembers: [
          { id: "board-1", name: "Board One", slug: { current: "board-1" } },
          { id: "board-2", name: "Board Two", slug: { current: "board-2" } },
          { id: "board-3", name: "Board Three", slug: { current: "board-3" } },
        ],
      };
      (CMSClient.meetTheTeamPage as jest.Mock).mockResolvedValue(
        pageWithBoardOnly,
      );

      // First board member - prev should wrap to last board member
      const firstResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: { section: "board" },
        params: { slug: "board-1" },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(firstResult).toMatchObject({
        props: {
          navigation: {
            prevHref: "/about-us/meet-the-team/board-3?section=board",
            nextHref: "/about-us/meet-the-team/board-2?section=board",
          },
        },
      });

      // Last board member - next should wrap to first board member
      const lastResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: { section: "board" },
        params: { slug: "board-3" },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(lastResult).toMatchObject({
        props: {
          navigation: {
            prevHref: "/about-us/meet-the-team/board-2?section=board",
            nextHref: "/about-us/meet-the-team/board-1?section=board",
          },
        },
      });
    });

    it("should wrap within leadership only when board is empty", async () => {
      const pageWithLeadershipOnly = {
        ...mockMeetTheTeamPage,
        leadershipTeam: [
          { id: "leader-1", name: "Leader One", slug: { current: "leader-1" } },
          { id: "leader-2", name: "Leader Two", slug: { current: "leader-2" } },
          {
            id: "leader-3",
            name: "Leader Three",
            slug: { current: "leader-3" },
          },
        ],
        boardMembers: [],
      };
      (CMSClient.meetTheTeamPage as jest.Mock).mockResolvedValue(
        pageWithLeadershipOnly,
      );

      // First leadership member - prev should wrap to last leadership member
      const firstResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: { section: "leadership" },
        params: { slug: "leader-1" },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(firstResult).toMatchObject({
        props: {
          navigation: {
            prevHref: "/about-us/meet-the-team/leader-3?section=leadership",
            nextHref: "/about-us/meet-the-team/leader-2?section=leadership",
          },
        },
      });

      // Last leadership member - next should wrap to first leadership member
      const lastResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: { section: "leadership" },
        params: { slug: "leader-3" },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(lastResult).toMatchObject({
        props: {
          navigation: {
            prevHref: "/about-us/meet-the-team/leader-2?section=leadership",
            nextHref: "/about-us/meet-the-team/leader-1?section=leadership",
          },
        },
      });
    });

    it("should return no navigation for single member in section", async () => {
      const pageWithSingleMember = {
        ...mockMeetTheTeamPage,
        leadershipTeam: [
          { id: "solo", name: "Solo Leader", slug: { current: "solo" } },
        ],
        boardMembers: [],
      };
      (CMSClient.meetTheTeamPage as jest.Mock).mockResolvedValue(
        pageWithSingleMember,
      );

      const result = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: { section: "leadership" },
        params: { slug: "solo" },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      // Single member with no other section - no navigation
      expect(result).toMatchObject({
        props: {
          navigation: {
            prevHref: null,
            nextHref: null,
          },
        },
      });
    });

    it("should wrap last leadership member next to first board member", async () => {
      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: { section: "leadership" },
        params: { slug: "ed-southall" }, // Last in leadership (index 1)
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        props: {
          navigation: {
            prevHref:
              "/about-us/meet-the-team/previous-member?section=leadership",
            nextHref: "/about-us/meet-the-team/next-member?section=board", // Wraps to first board
          },
        },
      });
    });

    it("should wrap first board member prev to last leadership member", async () => {
      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: { section: "board" },
        params: { slug: "next-member" }, // First (and only) in board
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        props: {
          navigation: {
            prevHref: "/about-us/meet-the-team/ed-southall?section=leadership", // Wraps to last leadership
            nextHref:
              "/about-us/meet-the-team/previous-member?section=leadership", // Wraps to first leadership
          },
        },
      });
    });
  });
});
