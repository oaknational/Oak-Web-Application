import { findFuzzyMatch } from "./fuzzyMatch";

describe("findFuzzyMatch", () => {
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
  describe("subjects", () => {
    it("should match subject names", () => {
      const result = findFuzzyMatch("History");
      expect(result?.subject).toBe("history");
    });

    it("should match partial subject names", () => {
      const result = findFuzzyMatch("hist");
      expect(result?.subject).toBe("history");
    });

    it("should match case-insensitive queries", () => {
      const result = findFuzzyMatch("HISTORY");
      expect(result?.subject).toBe("history");
    });

    it("should match with typos", () => {
      const result = findFuzzyMatch("histor");
      expect(result?.subject).toBe("history");
    });

    it("should match subject aliases", () => {
      const mathResult = findFuzzyMatch("mathematics");
      expect(mathResult?.subject).toBe("maths");

      const ictResult = findFuzzyMatch("ICT");
      expect(ictResult?.subject).toBe("computing");

      const dtResult = findFuzzyMatch("DT");
      expect(dtResult?.subject).toBe("design-technology");
    });
  });
  describe("keystages", () => {
    it("should match keystage slugs", () => {
      const ks1 = findFuzzyMatch("ks1");
      expect(ks1?.keyStage).toBe("ks1");

      const ks2 = findFuzzyMatch("ks2");
      expect(ks2?.keyStage).toBe("ks2");

      const ks3 = findFuzzyMatch("ks3");
      expect(ks3?.keyStage).toBe("ks3");

      const ks4 = findFuzzyMatch("ks4");
      expect(ks4?.keyStage).toBe("ks4");
    });
    it("should match key stage titles", () => {
      const ks1 = findFuzzyMatch("key stage 1");
      expect(ks1?.keyStage).toBe("ks1");

      const ks2 = findFuzzyMatch("key stage 2");
      expect(ks2?.keyStage).toBe("ks2");

      const ks3 = findFuzzyMatch("key stage 3");
      expect(ks3?.keyStage).toBe("ks3");

      const ks4 = findFuzzyMatch("key stage 4");
      expect(ks4?.keyStage).toBe("ks4");
    });
    it("should match with spaces", () => {
      const result = findFuzzyMatch("ks 1");
      expect(result?.keyStage).toBe("ks1");
    });
  });
});
