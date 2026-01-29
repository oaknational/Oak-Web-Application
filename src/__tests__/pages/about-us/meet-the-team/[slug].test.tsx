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

    const { getByAltText } = renderWithProviders()(
      <AboutUsMeetTheTeamPerson
        pageData={teamMemberWithImage}
        topNav={topNavFixture}
        navigation={mockNavigation}
      />,
    );

    expect(getByAltText("Test alt text")).toBeInTheDocument();
  });

  it("renders with socials", () => {
    const teamMemberWithSocials = {
      ...mockTeamMember,
      socials: {
        twitterUsername: "testuser",
        linkedinUrl: "https://linkedin.com/in/testuser",
      },
    };

    const { getByText } = renderWithProviders()(
      <AboutUsMeetTheTeamPerson
        pageData={teamMemberWithSocials}
        topNav={topNavFixture}
        navigation={mockNavigation}
      />,
    );

    expect(getByText("Twitter")).toBeInTheDocument();
    expect(getByText("LinkedIn")).toBeInTheDocument();
  });

  it("renders without navigation when no prev/next", () => {
    const noNavigation = {
      prevSlug: null,
      prevName: null,
      nextSlug: null,
      nextName: null,
    };

    const { queryByText } = renderWithProviders()(
      <AboutUsMeetTheTeamPerson
        pageData={mockTeamMember}
        topNav={topNavFixture}
        navigation={noNavigation}
      />,
    );

    expect(queryByText("Previous profile")).not.toBeInTheDocument();
    expect(queryByText("Next profile")).not.toBeInTheDocument();
  });

  it("renders with only previous navigation", () => {
    const prevOnlyNavigation = {
      prevSlug: "previous-member",
      prevName: "Previous Member",
      nextSlug: null,
      nextName: null,
    };

    const { getByText, queryByText } = renderWithProviders()(
      <AboutUsMeetTheTeamPerson
        pageData={mockTeamMember}
        topNav={topNavFixture}
        navigation={prevOnlyNavigation}
      />,
    );

    expect(getByText("Previous profile")).toBeInTheDocument();
    expect(queryByText("Next profile")).not.toBeInTheDocument();
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

    it("should return navigation with prev and next when member is in the middle", async () => {
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
          navigation: {
            prevSlug: "previous-member",
            nextSlug: "next-member",
          },
        },
      });
    });

    it("should return no prev navigation for first member", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(true);

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: {},
        params: {
          slug: "previous-member",
        },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        props: {
          navigation: {
            prevSlug: null,
            nextSlug: "ed-southall",
          },
        },
      });
    });

    it("should return no next navigation for last member", async () => {
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
          navigation: {
            prevSlug: "ed-southall",
            nextSlug: null,
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
            prevSlug: null,
            nextSlug: null,
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
            prevSlug: null,
            prevName: null,
            nextSlug: null,
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
            prevSlug: null,
            nextSlug: null,
          },
        },
      });
    });
  });
});
