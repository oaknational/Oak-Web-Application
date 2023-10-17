// import { getServerSideSitemap } from "next-sitemap";

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  subjectPhaseOptions: jest.fn().mockResolvedValue([
    {
      title: "English",
      slug: "english",
      phases: [
        { title: "Primary", slug: "primary" },
        { title: "Secondary", slug: "secondary" },
      ],
      examboards: [
        { title: "AQA", slug: "aqa" },
        { title: "Edexcel", slug: "edexcel" },
      ],
    },
    {
      title: "Geography",
      slug: "geography",
      phases: [
        { title: "Primary", slug: "primary" },
        { title: "Secondary", slug: "secondary" },
      ],
      examboards: null,
    },
  ]),
}));

describe("Curriculum phase options sitemap", () => {
  it("should call getServerSideSitemap with the expected data", async () => {
    // const sitemapBaseUrl = "http://example.com";
    // const context = {} as any;
    // const expectedFields = [];
    // await getServerSideProps(context);
    // expect(getServerSideSitemap).toHaveBeenCalledWith(context, expectedFields);
  });
});
