import { rankMatches } from "./rankMatches";

describe("rankMatches", () => {
  it.each([
    [
      "mathematics",
      [
        { slug: "computing", title: "Computing", matched: "cs" },
        { slug: "maths", title: "Mathematics", matched: "mathematics" },
      ],
      "maths",
    ],
    [
      "year 10",
      [
        { slug: "year-10", title: "Year 10", matched: "year 10" },
        { slug: "year-11", title: "Year 11", matched: "year 11" },
      ],
      "year-10",
    ],
  ])(
    "should rank partial matches behind full matches",
    (query, matches, slug) => {
      const result = rankMatches(query, matches);
      expect(result?.slug).toBe(slug);
    },
  );
  it.each([
    [
      "French AQA",
      [
        { slug: "french", title: "French", matched: "french" },
        {
          slug: "religious education",
          title: "Religious Education",
          matched: "re",
        },
      ],
      "french",
    ],
    [
      "Edexcel B geography",
      [
        { slug: "edexcel", title: "Edexcel", matched: "edexcel" },
        { slug: "edexcelb", title: "Edexcel B", matched: "Edexcel B" },
      ],
      "edexcelb",
    ],
  ])("should not favour longer matches", (query, matches, slug) => {
    const result = rankMatches(query, matches);
    expect(result?.slug).toBe(slug);
  });
  it("should prioritise whole word matches", () => {
    const result = rankMatches("Edexcel Biology", [
      { slug: "edexcel", title: "Edexcel", matched: "edexcel" },
      { slug: "edexcelb", title: "Edexcel B", matched: "Edexcel B" },
    ]);
    expect(result?.slug).toBe("edexcel");
  });
  it.each([
    [
      "chemistry science",
      [
        { slug: "science", title: "Science", matched: "science" },
        { slug: "science", title: "Science", matched: "Science" },
        { slug: "chemistry", title: "Chemistry", matched: "chemistry" },
        { slug: "chemistry", title: "Chemistry", matched: "Chemistry" },
        { slug: "chemistry", title: "Chemistry", matched: "bio" },
        { slug: "chemistry", title: "Chemistry", matched: "chemistry science" },
      ],
      "chemistry",
    ],
    [
      "biology science",
      [
        { slug: "science", title: "Science", matched: "science" },
        { slug: "science", title: "Science", matched: "Science" },
        { slug: "biology", title: "Biology", matched: "biology" },
        { slug: "biology", title: "Biology", matched: "Biology" },
        { slug: "biology", title: "Biology", matched: "bio" },
        { slug: "biology", title: "Biology", matched: "biology science" },
      ],
      "biology",
    ],
  ])("should handle science edge case terms", (query, matches, slug) => {
    const result = rankMatches(query, matches);
    expect(result?.slug).toBe(slug);
  });
});
