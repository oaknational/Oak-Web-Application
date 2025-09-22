import { findSuggestion } from "./findSuggestion";

describe("findSuggestion", () => {
  describe("fuzzy matching", () => {
    it("should match subject names", () => {
      const result = findSuggestion("History");
      expect(result).toMatchObject({
        type: "subject",
        title: "History",
        description: expect.stringContaining("Our history curriculum"),
      });
    });

    it("should match partial subject names", () => {
      const result = findSuggestion("hist");
      expect(result).toMatchObject({
        type: "subject",
        title: "History",
      });
    });

    it("should match case-insensitive queries", () => {
      const result = findSuggestion("HISTORY");
      expect(result).toMatchObject({
        type: "subject",
        title: "History",
      });
    });

    it("should match with typos", () => {
      const result = findSuggestion("histor");
      expect(result).toMatchObject({
        type: "subject",
        title: "History",
      });
    });
  });

  describe("key stage generation", () => {
    it("should generate correct key stage links", () => {
      const result = findSuggestion("English");
      expect(result?.keyStages).toEqual([
        {
          slug: "ks1",
          title: "Key stage 1",
          href: "/teachers/key-stages/ks1/subjects/english/programmes",
        },
        {
          slug: "ks2",
          title: "Key stage 2",
          href: "/teachers/key-stages/ks2/subjects/english/programmes",
        },
        {
          slug: "ks3",
          title: "Key stage 3",
          href: "/teachers/key-stages/ks3/subjects/english/programmes",
        },
        {
          slug: "ks4",
          title: "Key stage 4",
          href: "/teachers/key-stages/ks4/subjects/english/programmes",
        },
      ]);
    });
  });

  describe("edge cases", () => {
    it("should return null for empty query", () => {
      expect(findSuggestion("")).toBeNull();
    });

    it("should return null for whitespace-only query", () => {
      expect(findSuggestion("   ")).toBeNull();
    });

    it("should return null for single character query", () => {
      expect(findSuggestion("h")).toBeNull();
    });

    it("should return null for queries that don't match any subject", () => {
      expect(findSuggestion("xyzzyx")).toBeNull();
    });
  });

  describe("alias matching", () => {
    it("should match subject aliases", () => {
      const mathResult = findSuggestion("mathematics");
      expect(mathResult).toMatchObject({
        type: "subject",
        title: "Maths",
      });

      const ictResult = findSuggestion("ICT");
      expect(ictResult).toMatchObject({
        type: "subject",
        title: "Computing",
      });

      const dtResult = findSuggestion("DT");
      expect(dtResult).toMatchObject({
        type: "subject",
        title: "Design Technology",
      });
    });
  });

  describe("subject descriptions", () => {
    it("should include subject-specific terminology", () => {
      const historyResult = findSuggestion("History");
      expect(historyResult?.description).toContain("enquiry skills");

      const mathsResult = findSuggestion("Maths");
      expect(mathsResult?.description).toContain("mathematical fluency");

      const scienceResult = findSuggestion("Science");
      expect(scienceResult?.description).toContain("natural world");
    });
  });

  describe("URL structure", () => {
    it("should generate correct slug", () => {
      expect(findSuggestion("Design Technology")?.slug).toBe(
        "design-technology",
      );
    });
  });

  describe("data validation", () => {
    const allSubjects = [
      "History",
      "Maths",
      "Science",
      "Biology",
      "French",
      "English",
      "Computing",
      "Chemistry",
      "Citizenship",
      "Music",
      "Financial Education",
      "Geography",
      "Art",
      "Physics",
      "PE",
      "Drama",
      "Spanish",
      "German",
      "Design Technology",
      "PSHE",
      "RE",
    ];

    it("should have valid slug format for all subjects", () => {
      allSubjects.forEach((subject) => {
        const result = findSuggestion(subject);
        expect(result?.slug).toMatch(/^[a-z-]+$/);
      });
    });

    it("should have valid URL format for all key stages", () => {
      allSubjects.forEach((subject) => {
        const result = findSuggestion(subject);
        result?.keyStages.forEach((ks) => {
          expect(ks.href).toMatch(
            /^\/teachers\/key-stages\/ks[1-4]\/subjects\/[a-z-]+\/programmes$/,
          );
        });
      });
    });

    it("should have Oak-style descriptions for all subjects", () => {
      allSubjects.forEach((subject) => {
        const result = findSuggestion(subject);
        expect(result?.description).toMatch(
          /^Our .+ curriculum .+ with carefully sequenced units .+ over time\.$/,
        );
      });
    });
  });
});
