import { screen, waitFor } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";

import LandingPageTemplate, {
  getServerSideProps,
} from "../../../pages/lp/[landingPageSlug]";
import renderWithProviders from "../../__helpers__/renderWithProviders";
import CMSClient from "../../../node-lib/cms";
import renderWithSeo from "../../__helpers__/renderWithSeo";
import { LandingPage } from "../../../common-lib/cms-types/landingPage";
import { mockImageAsset, portableTextFromString } from "../../__helpers__/cms";

jest.mock("../../../node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const testLandingPage: LandingPage = {
  id: "5",
  slug: "some-landing-page",
  hero: {
    title: "some-landing-page",
    heading: "some-landing",
  },
  content: [
    {
      type: "LandingPageTextBlock",
      bodyPortableText: portableTextFromString("Contact summary"),
    },
    {
      type: "LandingPageTextAndMediaBlock",
      textAndMedia: {
        title: "title",
        bodyPortableText: [],
        alignMedia: "left",
        mediaType: "image",
        image: mockImageAsset(),
      },
    },
    {
      type: "LandingPageQuoteBlock",
      quote: {
        text: "text",
        attribution: "person mcpersonface",
      },
    },
    {
      type: "LandingPageFormBlock",
      bodyPortableText: [],
      title: "title",
      form: {
        title: "title of the form",
      },
    },
  ],
  seo: null,
};
jest.mock("next/dist/client/router", () => require("next-router-mock"));

const render = renderWithProviders();

describe("pages/lp/[landingPageSlug].tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    mockCMSClient.landingPages.mockResolvedValue([testLandingPage]);
    mockCMSClient.landingPageBySlug.mockResolvedValue(testLandingPage);
  });

  describe("LandingPage", () => {
    it("Renders title from props ", async () => {
      render(<LandingPageTemplate pageData={testLandingPage} />);
      await waitFor(() => {
        expect(screen.getByText("some-landing-page")).toBeInTheDocument();
      });
    });

    describe.skip("SEO", () => {
      it("renders the correct SEO details", async () => {
        const { seo } = renderWithSeo()(
          <LandingPageTemplate pageData={testLandingPage} />
        );

        expect(seo).toEqual({});
      });
    });
  });

  describe("getServerSideProps", () => {
    const getContext = (overrides: Partial<GetServerSidePropsContext>) =>
      ({
        req: {},
        res: {},
        query: {},
        params: { landingPageSlug: "some-landing-page" },
        ...overrides,
      } as unknown as GetServerSidePropsContext<{ landingPageSlug: string }>);

    it("Should fetch the correct landing page", async () => {
      await getServerSideProps(
        getContext({
          params: { landingPageSlug: "some-landing-page" },
        })
      );

      expect(mockCMSClient.landingPageBySlug).toHaveBeenCalledWith(
        "some-landing-page",
        expect.anything()
      );
    });

    it("should return notFound when a landing page is missing", async () => {
      mockCMSClient.landingPageBySlug.mockResolvedValueOnce(null as never);

      const propsResult = await getServerSideProps(
        getContext({
          params: { landingPageSlug: "some-landing-page" },
        })
      );

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
