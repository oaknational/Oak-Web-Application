import { GetStaticPropsContext } from "next";
import "jest-styled-components";

import renderWithProviders from "../../__helpers__/renderWithProviders";

import AboutUsMeetTheTeam, {
  AboutUsMeetTheTeamPageProps,
  getStaticProps,
} from "@/pages/about-us/meet-the-team";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import CMSClient from "@/node-lib/cms";
import { portableTextFromString, mockImageAsset } from "@/__tests__/__helpers__/cms";

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
  header: {
    introText: "Learn more about the experts from across education, technology, school support and education who make up our leadership team and board.",
    image: mockImageAsset(),
  },
  ourLeadership: {
    textRaw: portableTextFromString("Our leadership team brings together experts to deliver the best support to teachers and value for money for the public."),
    leadershipTeam: [mockTeamMember],
  },
  ourBoard: {
    textRaw: portableTextFromString("Our Board oversees all of our work at Oak National Academy. They provide strategic direction and safeguard our independence."),
    boardMembers: [mockTeamMember],
  },
  documents2: {
    files: [],
  },
  governance2: {
    textRaw: portableTextFromString("Test governance text"),
  },
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

  describe("getStaticProps", () => {
    it("should return props when CMS returns data", async () => {
      const propsResult = await getStaticProps({
        params: {},
      } as unknown as GetStaticPropsContext);

      expect(propsResult).toMatchObject({
        props: expect.anything(),
      });
    });

    it("should 404 when CMS returns no data", async () => {
      (CMSClient.meetTheTeamPage as jest.Mock).mockResolvedValue(null);

      const propsResult = await getStaticProps({
        params: {},
      } as unknown as GetStaticPropsContext);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
