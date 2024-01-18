import { screen } from "@testing-library/react";
import { vi } from "vitest";

import { WebinarPreview } from "@/common-lib/cms-types";
import {
  SerializedWebinarPreview,
  WebinarListingPageProps,
} from "@/components/GenericPagesViews/WebinarsIndex.view";
import WebinarListingPage from "@/pages/webinars";
import { mockSeoResult, mockVideoAsset } from "@/__tests__/__helpers__/cms";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";


const testPageData = {
  id: "123",
  title: "page title",
  heading: "page heading",
  summaryPortableText: [],
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

const webinars = vi.fn(() => [testWebinarPreview, testWebinarPreview2]);
const webinarsListingPage = vi.fn(() => testPageData);

const testSerializedWebinarPreview2: SerializedWebinarPreview = {
  ...testWebinarPreview2,
  date: testWebinarPreview2.date.toISOString(),
};

vi.doMock("@/node-lib/cms", () => ({
  __esModule: true,
  default: {
    webinars: webinars,
    webinarsListingPage: webinarsListingPage,
  },
}));

const render = renderWithProviders();

describe("pages/webinar/index.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("WebinarListingPage", () => {
    it("Renders a link to each webinar ", () => {
      render(
        <WebinarListingPage
          webinars={[
            testSerializedWebinarPreview,
            testSerializedWebinarPreview2,
          ]}
          pageData={testPageData}
          categories={[]}
          categorySlug={null}
        />,
      );

      expect(
        screen.getByText("An upcoming webinar").closest("a"),
      ).toHaveAttribute("href", "/webinars/an-upcoming-webinar");

      expect(screen.getByText("A past webinar").closest("a")).toHaveAttribute(
        "href",
        "/webinars/a-past-webinar",
      );
    });

    describe("SEO", () => {
      it.skip("renders the correct SEO details from the CMS", () => {
        const { seo } = renderWithSeo()(
          <WebinarListingPage
            webinars={[
              testSerializedWebinarPreview,
              testSerializedWebinarPreview2,
            ]}
            pageData={{
              ...testPageData,
              seo: {
                title: "Webinars SEO title",
                description: "Webinars SEO description",
                canonicalURL: "https://example.com/webinars",
              },
            }}
            categories={[]}
            categorySlug={null}
          />,
        );

        expect(seo).toMatchObject({
          title: "Webinars SEO title | NEXT_PUBLIC_SEO_APP_NAME",
          ogTitle: "Webinars SEO title | NEXT_PUBLIC_SEO_APP_NAME",
          description: "Webinars SEO description",
          ogDescription: "Webinars SEO description",
          canonical: "https://example.com/webinars",
        });
      });

      it.skip("renders the correct SEO fallbacks", () => {
        const { seo } = renderWithSeo()(
          <WebinarListingPage
            webinars={[
              testSerializedWebinarPreview,
              testSerializedWebinarPreview2,
            ]}
            pageData={testPageData}
            categories={[]}
            categorySlug={null}
          />,
        );

        expect(seo).toMatchObject({
          ...mockSeoResult,
          canonical: "NEXT_PUBLIC_SEO_APP_URL",
          title: "Webinars | NEXT_PUBLIC_SEO_APP_NAME",
          ogTitle: "Webinars | NEXT_PUBLIC_SEO_APP_NAME",
          description:
            "Join us for one of our scheduled webinars aimed at helping teachers to get the most out of Oak.",
          ogDescription:
            "Join us for one of our scheduled webinars aimed at helping teachers to get the most out of Oak.",
          ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
          ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        });
      });
    });
  });

  describe("getStaticProps", () => {
    it("Should return the webinars from the CMS", async () => {
      const { getStaticProps } = await import("@/pages/webinars");

      const propsResult = (await getStaticProps({})) as {
        props: WebinarListingPageProps;
      };
      expect(propsResult?.props?.webinars).toEqual([
        testSerializedWebinarPreview,
        testSerializedWebinarPreview2,
      ]);
    });

    it("Should not fetch draft content by default", async () => {
      const { getStaticProps } = await import("@/pages/webinars/index");

      await getStaticProps({});
      expect(webinars).toHaveBeenCalledWith({ previewMode: false });
      expect(webinarsListingPage).toHaveBeenCalledWith({ previewMode: false });
    });

    it("Should fetch draft content in preview mode", async () => {
      const { getStaticProps } = await import("@/pages/webinars/index");
      await getStaticProps({ preview: true });

      expect(webinars).toHaveBeenCalledWith({ previewMode: true });
      expect(webinarsListingPage).toHaveBeenCalledWith({ previewMode: true });
    });
  });
});
