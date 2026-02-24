import { screen } from "@testing-library/react";
import { forwardRef } from "react";
import { GetServerSidePropsContext } from "next";

import renderWithProviders from "../../__helpers__/renderWithProviders";
import AboutWhoWeAre, {
  getServerSideProps,
} from "../../../pages/about-us/who-we-are";
import CMSClient from "../../../node-lib/cms";
import {
  AboutWhoWeArePage,
  NewAboutWhoWeArePage,
} from "../../../common-lib/cms-types";
import { mockSeoResult, portableTextFromString } from "../../__helpers__/cms";
import renderWithSeo from "../../__helpers__/renderWithSeo";

import { testAboutPageBaseData } from "./about-us.fixtures";

import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

jest.mock("../../../node-lib/cms");
jest.mock("@mux/mux-player-react/lazy", () => {
  return forwardRef((props, ref) => {
    ref; // This prevents warning about ref not being used
    return <div data-testid="mux-player-mock" />;
  });
});

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const newTestAboutWhoWeArePageData: NewAboutWhoWeArePage = {
  header: {
    title: "",
    subTitle: "",
  },
  breakout: {
    image: {},
    text: "",
  },
  timeline: [
    {
      title: "",
      text: [],
      subTitle: "",
    },
  ],
  usp: [
    {
      title: "",
      image: {},
      text: "",
    },
  ],
};

const testAboutWhoWeArePageData: AboutWhoWeArePage = {
  ...testAboutPageBaseData,
  heading: "Who we are",
  intro: {
    title: "IGNORE THIS TITLE - Need to configure hidden fields",
    bodyPortableText: portableTextFromString("text"),
    cta: {
      label: "Blog about plans",
      linkType: "internal",
      internal: {
        id: "0001",
        contentType: "newsPost",
        slug: "some-blog-post",
      },
    },
    alignMedia: "left",
    mediaType: "video",
    video: {
      title: "Some video from the library because it's the only one I can find",
      video: {
        asset: {
          assetId: "ByqZ4KA9mLdyrtWnAvRMHbcQnNk2uUnf3NNdahrey5o",
          playbackId: "5VfBnOXD87KnXMJrYNG6HtCIizY6q6thP5EjjqkU1kI",
          thumbTime: null,
        },
      },
    },
  },
  timeline: {
    from: {
      title: "From Here",
      bodyPortableText: portableTextFromString("text"),
      cta: {
        label: "Blog about plans",
        linkType: "internal",
        internal: {
          id: "0002",
          contentType: "newsPost",
          slug: "some-blog-post",
        },
      },
    },
    to: {
      title: "To Here",
      bodyPortableText: portableTextFromString("text"),
      cta: null,
    },
    beyond: {
      title: "And Beyond",
      bodyPortableText: portableTextFromString("text"),
      cta: {
        label: "blog about plans",
        linkType: "internal",
        internal: {
          id: "0003",
          contentType: "newsPost",
          slug: "some-blog-post",
        },
      },
    },
    cta: {
      label: "Blog about plans",
      linkType: "internal",
      internal: {
        id: "0004",
        contentType: "newsPost",
        slug: "some-blog-post",
      },
    },
  },
  principles: [
    {
      title: "Independent",
      bodyPortableText: portableTextFromString("text"),
      cta: null,
    },
    {
      title: "Optional",
      bodyPortableText: portableTextFromString("text"),
      cta: null,
    },
    {
      title: "Adaptable",
      bodyPortableText: portableTextFromString("text"),
      cta: null,
    },
    {
      title: "Free",
      bodyPortableText: portableTextFromString("text"),
      cta: null,
    },
  ],
};

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => jest.fn().mockResolvedValue(topNavFixture)(),
  },
}));

describe("pages/about/who-we-are.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("Renders correct title ", () => {
    renderWithProviders()(
      <AboutWhoWeAre
        pageData={testAboutWhoWeArePageData}
        topNav={topNavFixture}
      />,
    );

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "About us",
    );
  });

  describe("SEO", () => {
    it("renders the correct SEO details", () => {
      const { seo } = renderWithSeo()(
        <AboutWhoWeAre
          pageData={testAboutWhoWeArePageData}
          topNav={topNavFixture}
        />,
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "About Us | NEXT_PUBLIC_SEO_APP_NAME",
        description: "We're doing the things that need to get done.",
        ogTitle: "About Us | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "We're doing the things that need to get done.",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
      });
    });
  });

  describe("getStaticProps", () => {
    it("should return notFound when the page data is missing", async () => {
      mockCMSClient.aboutWhoWeArePage.mockResolvedValueOnce(null);

      const propsResult = await getServerSideProps({
        req: {},
        res: {},
        query: {},
        params: {},
      } as unknown as GetServerSidePropsContext);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });

    it("should not return notFound when the page data is not missing", async () => {
      mockCMSClient.aboutWhoWeArePage.mockResolvedValueOnce(
        testAboutWhoWeArePageData,
      );

      mockCMSClient.newAboutWhoWeArePage.mockResolvedValueOnce(
        newTestAboutWhoWeArePageData,
      );

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: {},
        params: {},
      } as unknown as GetServerSidePropsContext);

      expect(propsResult).toMatchObject({
        props: {
          enableV2: true,
          pageData: testAboutWhoWeArePageData,
        },
      });
    });
  });
});

describe("pages/about/who-we-are.tsx (v2 enabled)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("renders ", () => {
    const { baseElement } = renderWithProviders()(
      <AboutWhoWeAre
        enableV2={true}
        pageData={testAboutWhoWeArePageData}
        topNav={topNavFixture}
      />,
    );

    expect(baseElement).toMatchSnapshot();
  });
});
