import { findFuzzyMatch } from "./fuzzyMatch";

describe("findFuzzyMatch", () => {
  it("should match subject names", () => {
    const result = findFuzzyMatch("History");
    expect(result).toMatchObject({
      type: "subject",
      title: "History",
      description: expect.stringContaining("Our history curriculum"),
    });
  });

  it("should match partial subject names", () => {
    const result = findFuzzyMatch("hist");
    expect(result).toMatchObject({
      type: "subject",
      title: "History",
    });
  });

  it("should match case-insensitive queries", () => {
    const result = findFuzzyMatch("HISTORY");
    expect(result).toMatchObject({
      type: "subject",
      title: "History",
    });
  });

  it("should match with typos", () => {
    const result = findFuzzyMatch("histor");
    expect(result).toMatchObject({
      type: "subject",
      title: "History",
    });
  });

  it("should return null for empty query", () => {
    expect(findFuzzyMatch("")).toBeNull();
  });

  it("should return null for whitespace-only query", () => {
    expect(findFuzzyMatch("   ")).toBeNull();
  });

  it("should return null for single character query", () => {
    expect(findFuzzyMatch("h")).toBeNull();
  });

  it("should return null for queries that don't match any subject", () => {
    expect(findFuzzyMatch("xyzzyx")).toBeNull();
  });

  it("should match subject aliases", () => {
    const mathResult = findFuzzyMatch("mathematics");
    expect(mathResult).toMatchObject({
      type: "subject",
      title: "Maths",
    });

    const ictResult = findFuzzyMatch("ICT");
    expect(ictResult).toMatchObject({
      type: "subject",
      title: "Computing",
    });

    const dtResult = findFuzzyMatch("DT");
    expect(dtResult).toMatchObject({
      type: "subject",
      title: "Design and technology",
    });
  });
  it("should include subject-specific terminology", () => {
    const historyResult = findFuzzyMatch("History");
    expect(historyResult?.description).toContain("rigorous historical enquiry");

    const mathsResult = findFuzzyMatch("Maths");
    expect(mathsResult?.description).toContain("Reasoning and problem solving");

    const scienceResult = findFuzzyMatch("Science");
    expect(scienceResult?.description).toContain(
      "practical and fieldwork skills, mathematical proficiencies, and an understanding of scientific practices",
    );
  });
});
