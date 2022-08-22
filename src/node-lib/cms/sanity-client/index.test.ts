import planningPageRawFixture from "../../../browser-lib/fixtures/lessonPlanningRaw.json";

const testWebinar = {
  title: "An upcoming webinar",
  id: "5",
  date: new Date("2025-01-01"),
  slug: { current: "an-upcoming-webinar" },
  hosts: [{ id: "000", name: "Hosty McHostFace" }],
  summaryPortableText: [],
};

const webinarBySlug = jest.fn(() => ({ allWebinar: [testWebinar] }));
const allWebinars = jest.fn(() => ({ allWebinar: [testWebinar] }));

const planningCorePage = jest.fn(() => planningPageRawFixture);

describe("cms/sanity-client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    jest.mock("../../sanity-graphql", () => ({
      __esModule: true,
      default: {
        allWebinars,
        webinarBySlug,
        planningCorePage,
      },
    }));
  });

  describe("webinarsBySlug", () => {
    it("fetches the specified webinar", async () => {
      const { default: getSanityClient } = await import("./");

      await getSanityClient().webinarBySlug("an-upcoming-webinar");

      expect(webinarBySlug).toBeCalledWith(
        expect.objectContaining({ slug: "an-upcoming-webinar" })
      );
    });

    it("returns a parsed webinar", async () => {
      const { default: getSanityClient } = await import("./");

      const result = await getSanityClient().webinarBySlug(
        "an-upcoming-webinar"
      );

      expect(result.slug).toBe("an-upcoming-webinar");
    });

    it("throws when a webinar is invalid", async () => {
      webinarBySlug.mockReturnValueOnce({
        allWebinar: [{ slug: "foo" }],
      } as never);
      const { default: getSanityClient } = await import("./");

      await expect(
        getSanityClient().webinarBySlug("an-upcoming-webinar")
      ).rejects.toThrow();
    });

    it("does not fetch draft content by default", async () => {
      const { default: getSanityClient } = await import("./");

      getSanityClient().webinarBySlug("an-upcoming-webinar");
      expect(webinarBySlug).toBeCalledWith(
        expect.objectContaining({ isDraft: false })
      );
    });

    it("fetches draft content when previewMode flag is passed", async () => {
      const { default: getSanityClient } = await import("./");

      getSanityClient().webinarBySlug("an-upcoming-webinar", {
        previewMode: true,
      });
      expect(webinarBySlug).toBeCalledWith(
        expect.objectContaining({ isDraft: true })
      );
    });
  });

  describe("webinars", () => {
    it("returns parsed webinars", async () => {
      const { default: getSanityClient } = await import("./");

      const result = await getSanityClient().webinars();
      expect(result?.[0]?.slug).toBe("an-upcoming-webinar");
    });

    it("throws when a webinar is invalid", async () => {
      allWebinars.mockReturnValueOnce({
        allWebinar: [{ slug: "foo" }],
      } as never);
      const { default: getSanityClient } = await import("./");

      await expect(getSanityClient().webinars()).rejects.toThrow();
    });

    it("does not fetch draft content by default", async () => {
      const { default: getSanityClient } = await import("./");

      await getSanityClient().webinars();
      expect(allWebinars).toBeCalledWith(
        expect.objectContaining({ isDraft: false })
      );
    });

    it("fetches draft content when previewMode flag is passed", async () => {
      const { default: getSanityClient } = await import("./");

      await getSanityClient().webinars({ previewMode: true });
      expect(allWebinars).toBeCalledWith(
        expect.objectContaining({ isDraft: true })
      );
    });
  });

  describe("planningPage", () => {
    it("does not fetch draft content by default", async () => {
      const { default: getSanityClient } = await import("./");
      await getSanityClient().planningPage();
      expect(planningCorePage).toBeCalledWith(
        expect.objectContaining({ isDraft: false })
      );
    });

    it("fetches draft content when previewMode flag is passed", async () => {
      const { default: getSanityClient } = await import("./");

      await getSanityClient().planningPage({ previewMode: true });
      expect(planningCorePage).toBeCalledWith(
        expect.objectContaining({ isDraft: true })
      );
    });
  });
});

// Silence module error
export {};
