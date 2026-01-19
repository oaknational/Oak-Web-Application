import { forwardRef } from "react";
import { GetServerSidePropsContext } from "next";
import "jest-styled-components";

import renderWithProviders from "../../__helpers__/renderWithProviders";

import { testAboutPageBaseData } from "./about-us.fixtures";

import AboutUsMeetTheTeam, {
  AboutUsMeetTheTeamPage,
  getServerSideProps,
} from "@/pages/about-us/meet-the-team";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

jest.mock("@/node-lib/posthog/getFeatureFlag");
jest.mock("../../../node-lib/cms");
jest.mock("@mux/mux-player-react/lazy", () => {
  return forwardRef((props, ref) => {
    ref; // This prevents warning about ref not being used
    return <div data-testid="mux-player-mock" />;
  });
});

const mockPerson = {
  slug: "ed-southall",
  name: "Ed Southall",
  position: "Subject Lead (maths)",
};

const mockDownload = {
  title: "Impact evaluation of Oak: 2023/24",
  subText: "PDF, 1.6MB",
  href: "#",
};

export const testAboutWhoWeArePageData: AboutUsMeetTheTeamPage["pageData"] = {
  ...testAboutPageBaseData,
  // title: "Meet the team",
  subTitle:
    "Learn more about the experts from across education, technology, school support and education who make up our leadership team and board.",
  leadershipTitle: "Our leadership",
  leadershipText:
    "Our leadership team brings together experts to deliver the best support to teachers and value for money for the public. Learn more about them below.",
  leadershipList: Array(12)
    .fill(true)
    .map(() => mockPerson),
  boardTitle: "Our board",
  boardText:
    "Our Board oversees all of our work at Oak National Academy. They provide strategic direction, enable us to deliver on our plans, scrutinise our work and safeguard our independence.",
  boardList: Array(12)
    .fill(true)
    .map(() => mockPerson),
  documentTitle: "Documents",
  documentText: null,
  documentList: Array(12)
    .fill(true)
    .map(() => mockDownload),
  governanceTitle: "Governance",
  governanceText:
    "Oak National Academy is a limited company incorporated under the Companies Act 2006 in September 2022 and whose sole shareholder is the Secretary of State for Education. It is a non-departmental public body (NDPB) which was established to work with schools, teachers and the wider education system and has a framework agreement with the Department for Education.",
};

describe("pages/about/meet-the-team.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("renders", () => {
    const { container } = renderWithProviders()(
      <AboutUsMeetTheTeam
        pageData={testAboutWhoWeArePageData}
        topNav={topNavFixture}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  describe("getStaticProps", () => {
    it("should 404 when not enabled", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(false);
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
