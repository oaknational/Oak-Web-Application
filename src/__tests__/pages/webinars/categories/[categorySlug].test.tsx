import { Webinar } from "../../../../common-lib/cms-types";

const testWebinar = {
  slug: "an-upcoming-webinar",
  category: { title: "Some category", slug: "some-webinar-category" },
} as Webinar;

const testWebinar2 = {
  slug: "a-past-webinar",
  category: { title: "Some other category", slug: "some-other-category" },
} as Webinar;
const webinars = jest.fn(() => [testWebinar, testWebinar2]);

describe("pages/webinar/categories/[categorySlug].tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.mock("../../../../node-lib/cms", () => ({
      __esModule: true,
      default: {
        webinars: jest.fn(webinars),
      },
    }));
  });

  describe("getStaticPaths", () => {
    it("Should return the paths of all webinar categories", async () => {
      const { getStaticPaths } = await import(
        "../../../../pages/webinars/categories/[categorySlug]"
      );

      const pathsResult = await getStaticPaths();

      expect(pathsResult.paths).toEqual([
        { params: { categorySlug: "some-webinar-category" } },
        { params: { categorySlug: "some-other-category" } },
      ]);
    });
  });
});
