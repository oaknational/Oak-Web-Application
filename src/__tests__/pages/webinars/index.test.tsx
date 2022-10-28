import { screen, waitFor } from "@testing-library/react";

import { WebinarPreview } from "../../../common-lib/cms-types";
import WebinarListingPage, {
  SerializedWebinarPreview,
  WebinarListingPageProps,
} from "../../../components/pages/WebinarsIndex.page";
import renderWithProviders from "../../__helpers__/renderWithProviders";
import renderWithSeo from "../../__helpers__/renderWithSeo";

const testWebinarPreview: WebinarPreview = {
  title: "An upcoming webinar",
  id: "5",
  slug: "an-upcoming-webinar",
  date: new Date("2022-12-01"),
  category: { title: "Some category", slug: "some-category" },
  summaryPortableText: [],
};

const testSerializedWebinarPreview: SerializedWebinarPreview = {
  ...testWebinarPreview,
  date: new Date("2022-12-01").toISOString(),
};

const testWebinarPreview2: WebinarPreview = {
  title: "A past webinar",
  id: "6",
  slug: "a-past-webinar",
  date: new Date("2022-12-31"),
  category: { title: "Some category", slug: "some-category" },
  summaryPortableText: [],
};

const testSerializedWebinarPreview2: SerializedWebinarPreview = {
  ...testWebinarPreview2,
  date: new Date("2022-12-31").toISOString(),
};

const webinars = jest.fn(() => [testWebinarPreview, testWebinarPreview2]);

describe("pages/webinar/index.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.mock("../../../node-lib/cms", () => ({
      __esModule: true,
      default: {
        webinars: webinars,
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

    describe.skip("SEO", () => {
      it("renders the correct SEO details", async () => {
        const { seo } = renderWithSeo(
          <WebinarListingPage
            webinars={[
              testSerializedWebinarPreview,
              testSerializedWebinarPreview2,
            ]}
            categories={[]}
            categorySlug={null}
          />
        );

        expect(seo).toEqual({});
      });
    });
  });

  describe("getStaticProps", () => {
    it("Should return the webinars from the CMS", async () => {
      const { getStaticProps } = await import(
        "../../../components/pages/WebinarsIndex.page"
      );

      const propsResult = (await getStaticProps({})) as {
        props: WebinarListingPageProps;
      };
      expect(propsResult?.props?.webinars).toEqual([
        testSerializedWebinarPreview,
        testSerializedWebinarPreview2,
      ]);
    });

    it("Should not fetch draft content by default", async () => {
      const { getStaticProps } = await import(
        "../../../components/pages/WebinarsIndex.page"
      );

      await getStaticProps({});
      expect(webinars).toHaveBeenCalledWith({ previewMode: false });
    });

    it("Should fetch draft content in preview mode", async () => {
      const { getStaticProps } = await import(
        "../../../components/pages/WebinarsIndex.page"
      );
      await getStaticProps({ preview: true });

      expect(webinars).toHaveBeenCalledWith({ previewMode: true });
    });
  });
});
