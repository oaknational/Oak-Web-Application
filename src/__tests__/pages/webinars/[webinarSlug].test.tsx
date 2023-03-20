import { screen, waitFor } from "@testing-library/react";

import { Webinar } from "../../../common-lib/cms-types";
import WebinarDetailPage, {
  SerializedWebinar,
  WebinarSinglePageProps,
} from "../../../pages/webinars/[webinarSlug]";
import { mockSeoResult, mockVideoAsset } from "../../__helpers__/cms";
import noop from "../../__helpers__/noop";
import renderWithProviders from "../../__helpers__/renderWithProviders";
import renderWithSeo from "../../__helpers__/renderWithSeo";

const webinarPageViewed = jest.fn();
jest.mock("../../../context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      webinarPageViewed: (...args: unknown[]) => webinarPageViewed(...args),
    },
    identify: noop,
  }),
}));

const testWebinar: Webinar = {
  title: "An upcoming webinar",
  id: "5",
  date: new Date("2025-01-01"),
  slug: "an-upcoming-webinar",
  hosts: [
    {
      id: "000",
      name: "Hosty McHostFace",
      image: {
        asset: {
          _id: "",
          url: "",
        },
      },
    },
  ],
  category: { title: "Some category", slug: "some-category" },
  summaryPortableText: [],
  video: mockVideoAsset(),
};

const testWebinar2: Webinar = {
  title: "A past webinar",
  id: "6",
  date: new Date("2022-01-01"),
  slug: "a-past-webinar",
  hosts: [
    {
      id: "000",
      name: "Hosty McHostFace",
      image: {
        asset: {
          _id: "",
          url: "",
        },
      },
    },
  ],
  category: { title: "Some category", slug: "some-category" },
  summaryPortableText: [],
  video: mockVideoAsset(),
};

const testSerializedWebinar: SerializedWebinar = {
  ...testWebinar,
  date: new Date().toISOString(),
  author: {
    name: "Joe Bloggs",
    role: "Geographer Teacher",
    id: "jbloggs",
  },
};

const webinars = jest.fn(() => [testWebinar, testWebinar2]);
const webinarBySlug = jest.fn(() => testWebinar);

describe("pages/webinar/[webinarSlug].tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.mock("../../../node-lib/cms", () => ({
      __esModule: true,
      default: {
        webinars: jest.fn(webinars),
        webinarBySlug: jest.fn(webinarBySlug),
      },
    }));
  });

  describe("WebinarDetailPage", () => {
    it("Renders title from props ", async () => {
      renderWithProviders(
        <WebinarDetailPage
          webinar={testSerializedWebinar}
          categories={[{ title: "Teaching", slug: "teaching" }]}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
          "An upcoming webinar"
        );
      });
    });

    it("calls tracking.webinarPageViewed once, with correct props", () => {
      renderWithProviders(
        <WebinarDetailPage
          webinar={testSerializedWebinar}
          categories={[{ title: "Teaching", slug: "teaching" }]}
        />
      );

      expect(webinarPageViewed).toHaveBeenCalledTimes(1);
      expect(webinarPageViewed).toHaveBeenCalledWith({
        videoAvailable: true,
        webinarCategory: "Some category",
        webinarTitle: "An upcoming webinar",
      });
    });

    describe("SEO", () => {
      it("renders the correct SEO details", async () => {
        const { seo } = renderWithSeo(
          <WebinarDetailPage
            webinar={testSerializedWebinar}
            categories={[{ title: "Teaching", slug: "teaching" }]}
          />
        );

        expect(seo).toEqual({
          ...mockSeoResult,
          title: "An upcoming webinar | NEXT_PUBLIC_SEO_APP_NAME",
          description: "NEXT_PUBLIC_SEO_APP_DESCRIPTION",
          ogTitle: "An upcoming webinar | NEXT_PUBLIC_SEO_APP_NAME",
          ogDescription: "NEXT_PUBLIC_SEO_APP_DESCRIPTION",
          ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
          ogImage:
            "https://image.mux.com/5678/thumbnail.png?width=1600&height=900&fit_mode=smartcrop&time=1",
          ogImageAlt: undefined,
          ogImageHeight: undefined,
          ogImageWidth: undefined,
          ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
          canonical: "NEXT_PUBLIC_SEO_APP_URL",
        });
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should return the paths of all webinars", async () => {
      const { getStaticPaths } = await import(
        "../../../pages/webinars/[webinarSlug]"
      );

      const pathsResult = await getStaticPaths();

      expect(pathsResult.paths).toEqual([
        { params: { webinarSlug: "an-upcoming-webinar" } },
        { params: { webinarSlug: "a-past-webinar" } },
      ]);
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct webinar", async () => {
      const { getStaticProps } = await import(
        "../../../pages/webinars/[webinarSlug]"
      );
      await getStaticProps({
        params: { webinarSlug: "an-upcoming-webinar" },
      });

      expect(webinarBySlug).toHaveBeenCalledWith(
        "an-upcoming-webinar",
        expect.any(Object)
      );
    });

    it("Should not fetch draft content by default", async () => {
      const { getStaticProps } = await import(
        "../../../pages/webinars/[webinarSlug]"
      );
      await getStaticProps({
        params: { webinarSlug: "an-upcoming-webinar" },
      });

      expect(webinarBySlug).toHaveBeenCalledWith("an-upcoming-webinar", {
        previewMode: false,
      });
    });

    it("Should fetch draft content in preview mode", async () => {
      const { getStaticProps } = await import(
        "../../../pages/webinars/[webinarSlug]"
      );
      await getStaticProps({
        params: { webinarSlug: "an-upcoming-webinar" },
        preview: true,
      });

      expect(webinarBySlug).toHaveBeenCalledWith("an-upcoming-webinar", {
        previewMode: true,
      });
    });

    it("Should format the webinar date", async () => {
      const { getStaticProps } = await import(
        "../../../pages/webinars/[webinarSlug]"
      );
      const propsResult = (await getStaticProps({
        params: { webinarSlug: "an-upcoming-webinar" },
      })) as { props: WebinarSinglePageProps };

      expect(propsResult?.props?.webinar).toMatchObject({
        date: "2025-01-01T00:00:00.000Z",
      });
    });

    it("should return notFound when a webinar is missing", async () => {
      webinarBySlug.mockResolvedValueOnce(null as never);

      const { getStaticProps } = await import(
        "../../../pages/webinars/[webinarSlug]"
      );
      const propsResult = (await getStaticProps({
        params: { webinarSlug: "an-upcoming-webinar" },
      })) as { props: WebinarSinglePageProps };

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
