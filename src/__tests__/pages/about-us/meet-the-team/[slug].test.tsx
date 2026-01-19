import { GetServerSidePropsContext } from "next";
import "jest-styled-components";

import renderWithProviders from "../../../__helpers__/renderWithProviders";
import { testAboutPageBaseData } from "../about-us.fixtures";

import AboutUsMeetTheTeamPerson, {
  AboutUsMeetTheTeamPersonPage,
  getServerSideProps,
} from "@/pages/about-us/meet-the-team/[slug]";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

jest.mock("@/node-lib/posthog/getFeatureFlag");
jest.mock("../../../../node-lib/cms");

const mockPerson = {
  slug: "ed-southall",
  name: "Ed Southall",
  position: "Subject Lead (maths)",
};

export const testAboutWhoWeArePageData: AboutUsMeetTheTeamPersonPage["pageData"] =
  {
    ...testAboutPageBaseData,
    // title: "Meet the team",
    ...mockPerson,
  };

describe("pages/about/meet-the-team/[slug].tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("renders", () => {
    const { container } = renderWithProviders()(
      <AboutUsMeetTheTeamPerson
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
        params: {
          slug: "test",
        },
      } as unknown as GetServerSidePropsContext<{ slug: string }>);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
