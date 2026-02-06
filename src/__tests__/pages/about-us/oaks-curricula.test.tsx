import { GetServerSidePropsContext } from "next";
import "jest-styled-components";

import renderWithProviders from "../../__helpers__/renderWithProviders";

import { testAboutPageBaseData } from "./about-us.fixtures";

import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { portableTextFromString } from "@/__tests__/__helpers__/cms";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import OaksCurricula, {
  OaksCurriculaPage,
  getServerSideProps,
} from "@/pages/about-us/oaks-curricula";

jest.mock("@/node-lib/posthog/getFeatureFlag");
jest.mock("../../../node-lib/cms");
globalThis.matchMedia = jest.fn().mockReturnValue({
  matches: true,
});

const testAboutWhoWeArePageData: OaksCurriculaPage["pageData"] = {
  ...testAboutPageBaseData,
  header: {
    textRaw: portableTextFromString(
      "We need your help to understand what's needed in the classroom. Want to get involved? We can't wait to hear from you.",
    ),
  },
  partners: {
    legacy: new Array(16).fill(true).map((_, index) => {
      return { imageUrl: `/#${index}`, alt: "" };
    }),
    current: new Array(16).fill(true).map((_, index) => {
      return { imageUrl: `/#${index}`, alt: "" };
    }),
  },
  curriculumPhaseOptions: {
    subjects: [
      {
        title: "Maths",
        slug: "maths",
        phases: [],
        ks4_options: null,
      },
    ],
    tab: "units",
  },
};

describe("pages/about/oaks-curricula.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("renders", () => {
    const { container, getAllByRole } = renderWithProviders()(
      <OaksCurricula
        pageData={testAboutWhoWeArePageData}
        topNav={topNavFixture}
      />,
    );

    expect(container).toMatchSnapshot();
    const headings = getAllByRole("heading", { level: 2 });
    expect(headings[0]).toHaveTextContent("Our guiding principles");
    expect(headings[1]).toHaveTextContent("See Oak’s curriculum in practice");
    expect(headings[2]).toHaveTextContent("Curriculum partners");
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
