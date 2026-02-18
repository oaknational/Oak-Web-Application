import { GetServerSidePropsContext } from "next";
import "jest-styled-components";

import renderWithProviders from "../../__helpers__/renderWithProviders";

import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { portableTextFromString } from "@/__tests__/__helpers__/cms";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import OaksCurricula, {
  OaksCurriculaPageProps,
  getServerSideProps,
} from "@/pages/about-us/oaks-curricula";
import CMSClient from "@/node-lib/cms";

jest.mock("@/node-lib/posthog/getFeatureFlag");
jest.mock("../../../node-lib/cms");

const mockImage = {
  altText: "test image",
  isPresentational: false,
  asset: { _id: "image-123", url: "https://cdn.sanity.io/images/test.png" },
  hotspot: null,
};

const mockPageData: OaksCurriculaPageProps["pageData"] = {
  id: "newAboutCorePage.oaksCurricula",
  header: {
    subtitlePortableText: portableTextFromString(
      "Oak offers complete curriculum support for clarity and coherence in every national curriculum subject.",
    ),
    image: mockImage,
  },
  guidingPrinciples: {
    image: mockImage,
    principles: [
      {
        heading: "Evidence-informed",
        text: "Our approach enables the rigorous application of research outcomes.",
      },
      {
        heading: "Knowledge and vocabulary rich",
        text: "Our curriculum is knowledge and vocabulary rich.",
      },
    ],
  },
  currentPartners: {
    partners: [{ logo: mockImage }],
  },
  legacyPartners: {
    partners: [{ logo: mockImage }],
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
    expect(headings[1]).toHaveTextContent("See Oak's curriculum in practice");
    expect(headings[2]).toHaveTextContent("Curriculum partners");
  });

  it("does not render current partners section when no current partners", () => {
    const pageDataWithoutCurrentPartners = {
      ...mockPageData,
      currentPartners: { partners: null },
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
      legacyPartners: { partners: null },
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
      currentPartners: { partners: null },
      legacyPartners: { partners: null },
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

  describe("getServerSideProps", () => {
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

    it("should 404 when CMS returns null", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(true);
      (CMSClient.oaksCurriculaPage as jest.Mock).mockResolvedValue(null);
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
