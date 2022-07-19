import { screen, waitFor } from "@testing-library/react";

import WebinarDetailPage, {
  WebinarPageProps,
} from "../../pages/webinars/[webinarSlug]";
import renderWithProviders from "../__helpers__/renderWithProviders";

const testWebinar = {
  title: "An upcoming webinar",
  id: "5",
  date: new Date("2025-01-01"),
  slug: "an-upcoming-webinar",
  hosts: [{ id: "000", name: "Hosty McHostFace" }],
  summaryPortableText: [],
};

const testWebinar2 = {
  title: "A past webinar",
  id: "6",
  date: new Date("2022-01-01"),
  slug: "a-past-webinar",
  hosts: [{ id: "000", name: "Hosty McHostFace" }],
  summaryPortableText: [],
};

const testSerializedWebinar = {
  ...testWebinar,
  date: new Date().toISOString(),
};

const webinars = jest.fn(() => [testWebinar, testWebinar2]);
const webinarBySlug = jest.fn(() => testWebinar);

describe("pages/webinar/[webinarSlug].tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.mock("../../node-lib/cms", () => ({
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
        <WebinarDetailPage webinar={testSerializedWebinar} />
      );

      await waitFor(() => {
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
          "An upcoming webinar"
        );
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should return the paths of all webinars", async () => {
      const { getStaticPaths } = await import(
        "../../pages/webinars/[webinarSlug]"
      );

      const pathsResult = await getStaticPaths({});

      expect(pathsResult.paths).toEqual([
        { params: { webinarSlug: "an-upcoming-webinar" } },
        { params: { webinarSlug: "a-past-webinar" } },
      ]);
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct webinar", async () => {
      const { getStaticProps } = await import(
        "../../pages/webinars/[webinarSlug]"
      );
      await getStaticProps({ params: { webinarSlug: "an-upcoming-webinar" } });

      expect(webinarBySlug).toHaveBeenCalledWith("an-upcoming-webinar");
    });

    it("Should format the webinar date", async () => {
      const { getStaticProps } = await import(
        "../../pages/webinars/[webinarSlug]"
      );
      const propsResult = (await getStaticProps({
        params: { webinarSlug: "an-upcoming-webinar" },
      })) as { props: WebinarPageProps };

      expect(propsResult?.props?.webinar).toMatchObject({
        date: "2025-01-01T00:00:00.000Z",
      });
    });
  });
});
