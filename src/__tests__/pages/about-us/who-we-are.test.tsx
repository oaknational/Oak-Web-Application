import { screen, waitFor } from "@testing-library/react";

import renderWithProviders from "../../__helpers__/renderWithProviders";
import AboutWhoWeAre, {
  getStaticProps,
} from "../../../pages/about-us/who-we-are";
import CMSClient, { AboutWhoWeArePage } from "../../../node-lib/cms";
import { mockSeo, portableTextFromString } from "../../__helpers__/cms";
import renderWithSeo from "../../__helpers__/renderWithSeo";

jest.mock("../../../node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

export const testAboutPageBaseData = {
  title: "About Oak",
  contactSection: {
    infoPortableText: [
      {
        _key: "e0c6f10a0bae",
        _type: "block",
        children: [
          {
            _key: "16137e0bde570",
            _type: "span",
            marks: ["strong"],
            text: "General enquiries",
          },
          {
            _key: "b582301fb277",
            _type: "span",
            marks: [],
            text: "\nFor general enquiries and help please email help@thenational.academy.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _key: "71550ecd4198",
        _type: "block",
        children: [
          {
            _key: "b2e4daa056f3",
            _type: "span",
            marks: [],
            text: "\n",
          },
          {
            _key: "ce05d051065d",
            _type: "span",
            marks: ["strong"],
            text: "Media enquiries",
          },
          {
            _key: "189f67954654",
            _type: "span",
            marks: [],
            text: "\nFor media enquiries, please contact media@thenational.academy.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _key: "8899b1fff883",
        _type: "block",
        children: [
          {
            _key: "bcf96460c3ca",
            _type: "span",
            marks: [],
            text: "\n",
          },
          {
            _key: "813237286594",
            _type: "span",
            marks: ["strong"],
            text: "Get support",
          },
          {
            _key: "2931ce4285fa",
            _type: "span",
            marks: [],
            text: "\nYou’ll find lots of help and support for teachers, schools, pupils and parents in our ",
          },
          {
            _key: "37c37aae53f3",
            _type: "span",
            marks: ["9f907ea04c75"],
            text: "Help Centre",
          },
          {
            _key: "4b8a6dd13f39",
            _type: "span",
            marks: [],
            text: ".",
          },
        ],
        markDefs: [
          {
            _key: "9f907ea04c75",
            _type: "link",
            href: "https://support.thenational.academy/",
          },
        ],
        style: "normal",
      },
    ],
  },
  id: "aboutCorePage",
  seo: mockSeo(),
};

const testAboutWhoWeArePageData: AboutWhoWeArePage = {
  ...testAboutPageBaseData,
  sectionHeading: "Who we are",
  intro: {
    title: "IGNORE THIS TITLE - Need to configure hidden fields",
    bodyPortableText: portableTextFromString("text"),
    cta: {
      label: "Blog about plans",
      linkType: "internal",
      internal: {
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
          contentType: "newsPost",
          slug: "some-blog-post",
        },
      },
    },
    cta: {
      label: "Blog about plans",
      linkType: "internal",
      internal: {
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

describe("pages/about/who-we-are.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("Renders correct title ", async () => {
    renderWithProviders(<AboutWhoWeAre pageData={testAboutWhoWeArePageData} />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "About us"
      );
    });
  });

  describe.skip("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo(
        <AboutWhoWeAre pageData={testAboutWhoWeArePageData} />
      );

      expect(seo).toEqual({});
    });
  });

  describe("getStaticProps", () => {
    it("should return notFound when the page data is missing", async () => {
      mockCMSClient.aboutWhoWeArePage.mockResolvedValueOnce(null);

      const propsResult = await getStaticProps({
        params: {},
      });

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
