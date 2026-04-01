import { GetStaticPropsContext } from "next";
import "jest-styled-components";

import renderWithProviders from "../../__helpers__/renderWithProviders";

import { portableTextFromString, mockImageAsset } from "@/__tests__/__helpers__/cms";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import OaksCurricula, {
  OaksCurriculaPageProps,
  getStaticProps,
} from "@/pages/about-us/oaks-curricula";
import CMSClient from "@/node-lib/cms";

jest.mock("../../../node-lib/cms");

const mockPageData: OaksCurriculaPageProps["pageData"] = {
  header: {
    introText: "Oak offers complete curriculum support for clarity and coherence in every national curriculum subject.",
    image: mockImageAsset(),
  },
  guidingPrinciples: {
    textRaw: portableTextFromString("Our guiding principles guide our approach."),
    image: mockImageAsset(),
    principles: [
      {
        heading: "Evidence-informed",
        text2Raw: portableTextFromString("Our approach enables the rigorous application of research outcomes."),
      },
      {
        heading: "Knowledge and vocabulary rich",
        text2Raw: portableTextFromString("Our curriculum is knowledge and vocabulary rich."),
      },
    ],
  },
  currentPartners: {
    textRaw: portableTextFromString("Our current partners"),
    partners: [{ logo: mockImageAsset() }],
  },
  legacyPartners: {
    textRaw: portableTextFromString("Our legacy partners"),
    partners: [{ logo: mockImageAsset() }],
  },
  seo: null,
};

const mockCurriculumPhaseOptions: OaksCurriculaPageProps["curriculumPhaseOptions"] =
  {
    subjects: [
      {
        title: "Maths",
        slug: "maths",
        phases: [],
        ks4_options: null,
      },
    ],
    tab: "units",
  };

describe("pages/about/oaks-curricula.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    (CMSClient.oaksCurriculaPage as jest.Mock).mockResolvedValue(mockPageData);
  });

  it("renders", () => {
    const { container, getAllByRole } = renderWithProviders()(
      <OaksCurricula
        pageData={mockPageData}
        curriculumPhaseOptions={mockCurriculumPhaseOptions}
        topNav={topNavFixture}
      />,
    );

    expect(container).toMatchSnapshot();
    const headings = getAllByRole("heading", { level: 2 });
    expect(headings[0]).toHaveTextContent("Our guiding principles");
    expect(headings[1]).toHaveTextContent("See Oak's curricula in practice");
    expect(headings[2]).toHaveTextContent("Curriculum partners");
  });

  it("does not render current partners section when no current partners", () => {
    const pageDataWithoutCurrentPartners = {
      ...mockPageData,
      currentPartners: { 
        textRaw: portableTextFromString("Our current partners"),
        partners: [],
      },
    };
    const { queryByText } = renderWithProviders()(
      <OaksCurricula
        pageData={
          pageDataWithoutCurrentPartners as OaksCurriculaPageProps["pageData"]
        }
        curriculumPhaseOptions={mockCurriculumPhaseOptions}
        topNav={topNavFixture}
      />,
    );

    expect(queryByText("Current")).not.toBeInTheDocument();
    expect(queryByText("Legacy")).toBeInTheDocument();
  });

  it("does not render legacy partners section when no legacy partners", () => {
    const pageDataWithoutLegacyPartners = {
      ...mockPageData,
      legacyPartners: { 
        textRaw: portableTextFromString("Our legacy partners"),
        partners: [],
      },
    };
    const { queryByText } = renderWithProviders()(
      <OaksCurricula
        pageData={
          pageDataWithoutLegacyPartners as OaksCurriculaPageProps["pageData"]
        }
        curriculumPhaseOptions={mockCurriculumPhaseOptions}
        topNav={topNavFixture}
      />,
    );

    expect(queryByText("Current")).toBeInTheDocument();
    expect(queryByText("Legacy")).not.toBeInTheDocument();
  });

  it("does not render curriculum partners section when no partners at all", () => {
    const pageDataWithoutPartners = {
      ...mockPageData,
      currentPartners: { 
        textRaw: portableTextFromString("Our current partners"),
        partners: [],
      },
      legacyPartners: { 
        textRaw: portableTextFromString("Our legacy partners"),
        partners: [],
      },
    };
    const { queryByText } = renderWithProviders()(
      <OaksCurricula
        pageData={pageDataWithoutPartners as OaksCurriculaPageProps["pageData"]}
        curriculumPhaseOptions={mockCurriculumPhaseOptions}
        topNav={topNavFixture}
      />,
    );

    expect(queryByText("Curriculum partners")).not.toBeInTheDocument();
  });

  describe("getStaticProps", () => {
    it("should 404 when CMS returns null", async () => {
      (CMSClient.oaksCurriculaPage as jest.Mock).mockResolvedValue(null);
      const propsResult = await getStaticProps({
        params: {},
      } as unknown as GetStaticPropsContext);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
