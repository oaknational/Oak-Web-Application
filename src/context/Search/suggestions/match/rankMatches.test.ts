import { rankMatches } from "./rankMatches";

describe("rankMatches", () => {
  it.each([
    [
      "mathematics",
      [
        { slug: "computing", matched: "cs" },
        { slug: "maths", matched: "mathematics" },
      ],
      "maths",
    ],
    [
      "year 10",
      [
        { slug: "year-10", matched: "year 10" },
        { slug: "year-11", matched: "year 11" },
      ],
      "year-10",
    ],
  ])(
    "should rank partial matches behind full matches",
    (query, matches, slug) => {
      const result = rankMatches(query, matches);
      expect(result).toBe(slug);
    },
  );
  it.each([
    [
      "French AQA",
      [
        { slug: "french", matched: "french" },
        { slug: "religious education", matched: "re" },
      ],
      "french",
    ],
    [
      "Edexcel B geography",
      [
        { slug: "edexcel", matched: "edexcel" },
        { slug: "edexcelb", matched: "Edexcel B" },
      ],
      "edexcelb",
    ],
  ])("should not favour longer matches", (query, matches, slug) => {
    const result = rankMatches(query, matches);
    expect(result).toBe(slug);
  });
  it("should prioritise whole word matches", () => {
    const result = rankMatches("Edexcel Biology", [
      { slug: "edexcel", matched: "edexcel" },
      { slug: "edexcelb", matched: "Edexcel B" },
    ]);
    expect(result).toBe("edexcel");
  });
  it.each([
    [
      "chemistry science",
      [
        { slug: "science", matched: "science" },
        { slug: "science", matched: "Science" },
        { slug: "chemistry", matched: "chemistry" },
        { slug: "chemistry", matched: "Chemistry" },
        { slug: "chemistry", matched: "bio" },
        { slug: "chemistry", matched: "chemistry science" },
      ],
      "chemistry",
    ],
    [
      "biology science",
      [
        { slug: "science", matched: "science" },
        { slug: "science", matched: "Science" },
        { slug: "biology", matched: "biology" },
        { slug: "biology", matched: "Biology" },
        { slug: "biology", matched: "bio" },
        { slug: "biology", matched: "biology science" },
      ],
      "biology",
    ],
  ])("should handle science edge case terms", (query, matches, slug) => {
    const result = rankMatches(query, matches);
    expect(result).toBe(slug);
  });
});
