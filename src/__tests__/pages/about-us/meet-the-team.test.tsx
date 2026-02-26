import { GetServerSidePropsContext } from "next";
import "jest-styled-components";

import renderWithProviders from "../../__helpers__/renderWithProviders";

import AboutUsMeetTheTeam, {
  AboutUsMeetTheTeamPageProps,
  getServerSideProps,
} from "@/pages/about-us/meet-the-team";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import CMSClient from "@/node-lib/cms";

jest.mock("../../../node-lib/cms");

const mockTeamMember = {
  id: "test-id",
  name: "Ed Southall",
  role: "Subject Lead (maths)",
  slug: { current: "ed-southall" },
  image: null,
  bioPortableText: null,
  socials: null,
  hotspot: null,
};

const mockPageData: AboutUsMeetTheTeamPageProps["pageData"] = {
  id: "test-page-id",
  title: "Meet the Team",
  introText:
    "Learn more about the experts from across education, technology, school support and education who make up our leadership team and board.",
  leadershipText:
    "Our leadership team brings together experts to deliver the best support to teachers and value for money for the public.",
  boardText:
    "Our Board oversees all of our work at Oak National Academy. They provide strategic direction and safeguard our independence.",
  leadershipTeam: [mockTeamMember],
  boardMembers: [mockTeamMember],
  documents: null,
  governancePortableText: [
    {
      _type: "block",
      children: [{ _type: "span", text: "Test governance text" }],
    },
  ],
  seo: null,
};

describe("pages/about/meet-the-team.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (CMSClient.meetTheTeamPage as jest.Mock).mockResolvedValue(mockPageData);
  });

  it("renders", () => {
    const { container } = renderWithProviders()(
      <AboutUsMeetTheTeam pageData={mockPageData} topNav={topNavFixture} />,
    );

    expect(container).toMatchSnapshot();
  });

  describe("getServerSideProps", () => {
    it("should return props when CMS returns data", async () => {
      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: {},
        params: {},
      } as unknown as GetServerSidePropsContext);

      expect(propsResult).toMatchObject({
        props: expect.anything(),
      });
    });

    it("should 404 when CMS returns no data", async () => {
      (CMSClient.meetTheTeamPage as jest.Mock).mockResolvedValue(null);

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: {},
        params: {},
      } as unknown as GetServerSidePropsContext);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
