import { screen, waitFor } from "@testing-library/react";

import { WebinarPreview } from "../../../common-lib/cms-types";
import WebinarListingPage, {
  SerializedWebinarPreview,
  WebinarListingPageProps,
} from "../../../components/pages/WebinarsIndex.page";
import { mockVideoAsset } from "../../__helpers__/cms";
import renderWithProviders from "../../__helpers__/renderWithProviders";
import renderWithSeo from "../../__helpers__/renderWithSeo";

const testPageData = {
  id: "123",
  title: "page title",
  heading: "page heading",
  summary: [],
};

const testWebinarPreview: WebinarPreview = {
  title: "An upcoming webinar",
  id: "5",
  slug: "an-upcoming-webinar",
  date: new Date("2057-12-01"),
  category: { title: "Some category", slug: "some-category" },
  summaryPortableText: [],
  video: mockVideoAsset(),
  hosts: [
    {
      id: "1",
      name: "name",
    },
  ],
};

const testSerializedWebinarPreview: SerializedWebinarPreview = {
  ...testWebinarPreview,
  date: testWebinarPreview.date.toISOString(),
};

const testWebinarPreview2: WebinarPreview = {
  title: "A past webinar",
  id: "6",
  slug: "a-past-webinar",
  date: new Date("2021-12-31"),
  category: { title: "Some category", slug: "some-category" },
  summaryPortableText: [],
  video: mockVideoAsset(),
  hosts: [
    {
      id: "1",
      name: "name",
    },
  ],
};

const testSerializedWebinarPreview2: SerializedWebinarPreview = {
  ...testWebinarPreview2,
  date: testWebinarPreview2.date.toISOString(),
};

const webinars = jest.fn(() => [testWebinarPreview, testWebinarPreview2]);
const webinarsListingPage = jest.fn(() => testPageData);

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("pages/webinar/index.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.mock("../../../node-lib/cms", () => ({
      __esModule: true,
      default: {
        webinars: webinars,
        webinarsListingPage: webinarsListingPage,
      },
    }));
  });

  describe("WebinarListingPage", () => {
    it("Renders a link to each webinar ", async () => {
      renderWithProviders(
        <WebinarListingPage
          webinars={[
            testSerializedWebinarPreview,
            testSerializedWebinarPreview2,
          ]}
          pageData={testPageData}
          categories={[]}
          categorySlug={null}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText("An upcoming webinar").closest("a")
        ).toHaveAttribute("href", "/webinars/an-upcoming-webinar");

        expect(screen.getByText("A past webinar").closest("a")).toHaveAttribute(
          "href",
          "/webinars/a-past-webinar"
        );
      });
    });

    describe("SEO", () => {
      it("renders the correct SEO details from the CMS", async () => {
        const { seo } = renderWithSeo(
          <WebinarListingPage
            webinars={[
              testSerializedWebinarPreview,
              testSerializedWebinarPreview2,
            ]}
            pageData={{
              ...testPageData,
              seo: {
                title: "Webinar SEO title",
                description: "Webinar SEO description",
                canonicalURL: "https://example.com/webinars",
              },
            }}
            categories={[]}
            categorySlug={null}
          />
        );

        expect(seo).toMatchObject({
          title: "Webinar SEO title | NEXT_PUBLIC_SEO_APP_NAME",
          ogTitle: "Webinars SEO title | NEXT_PUBLIC_SEO_APP_NAME",
          description: "Webinar SEO description | NEXT_PUBLIC_SEO_APP_NAME",
          ogDescription: "Webinar SEO description | NEXT_PUBLIC_SEO_APP_NAME",
          canonical: "https://example.com/webinars",
        });
      });

      it("renders the correct SEO fallbacks", async () => {
        const { seo } = renderWithSeo(
          <WebinarListingPage
            webinars={[
              testSerializedWebinarPreview,
              testSerializedWebinarPreview2,
            ]}
            pageData={testPageData}
            categories={[]}
            categorySlug={null}
          />
        );

        expect(seo).toMatchObject({
          canonical: "NEXT_PUBLIC_SEO_APP_URL",
          description: "Webinars",
          ogDescription: "Webinars",
          ogImage:
            "NEXT_PUBLIC_SEO_APP_URLNEXT_PUBLIC_SEO_APP_SOCIAL_SHARING_IMG?2022",
          ogImageAlt: undefined,
          ogImageHeight: undefined,
          ogImageWidth: undefined,
          ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
          ogTitle: "Webinars | NEXT_PUBLIC_SEO_APP_NAME",
          ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
          title: "Webinars | NEXT_PUBLIC_SEO_APP_NAME",
        });
      });
    });
  });

  describe("getStaticProps", () => {
    it("Should return the webinars from the CMS", async () => {
      const { getStaticProps } = await import("../../../pages/webinars");

      const propsResult = (await getStaticProps({})) as {
        props: WebinarListingPageProps;
      };
      expect(propsResult?.props?.webinars).toEqual([
        testSerializedWebinarPreview,
        testSerializedWebinarPreview2,
      ]);
    });

    it.skip("Should not fetch draft content by default", async () => {
      const { getStaticProps } = await import("../../../pages/webinars/index");

      await getStaticProps({});
      expect(webinars).toHaveBeenCalledWith({ previewMode: false });
      expect(webinarsListingPage).toHaveBeenCalledWith({ previewMode: false });
    });

    it("Should fetch draft content in preview mode", async () => {
      const { getStaticProps } = await import("../../../pages/webinars/index");
      await getStaticProps({ preview: true });

      expect(webinars).toHaveBeenCalledWith({ previewMode: true });
      expect(webinarsListingPage).toHaveBeenCalledWith({ previewMode: true });
    });
  });
});
