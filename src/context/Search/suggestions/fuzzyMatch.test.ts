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
      expect(result).toMatchObject({ subject: "history", keyStage: null });
    });

    it("should match partial subject names", () => {
      const result = findFuzzyMatch("hist");
      expect(result).toMatchObject({ subject: "history", keyStage: null });
    });

    it("should match case-insensitive queries", () => {
      const result = findFuzzyMatch("HISTORY");
      expect(result).toMatchObject({ subject: "history", keyStage: null });
    });

    it("should match with typos", () => {
      const result = findFuzzyMatch("histor");
      expect(result).toMatchObject({ subject: "history", keyStage: null });
    });

    it("should match subject aliases", () => {
      const mathResult = findFuzzyMatch("mathematics");
      expect(mathResult).toMatchObject({ subject: "maths", keyStage: null });

      const ictResult = findFuzzyMatch("ICT");
      expect(ictResult).toMatchObject({ subject: "computing", keyStage: null });

      const dtResult = findFuzzyMatch("DT");
      expect(dtResult).toMatchObject({
        subject: "design-technology",
        keyStage: null,
      });
    });
    it("should not match longer strings with subjects in them", () => {
      const result = findFuzzyMatch(
        "the history of mathematics in ancient greece",
      );
      expect(result).toBeNull();

      const result2 = findFuzzyMatch("the geography of the nile river");
      expect(result2).toBeNull();
    });
  });
  describe("keystages", () => {
    it("should match keystage slugs", () => {
      const ks1 = findFuzzyMatch("ks1");
      expect(ks1).toMatchObject({ subject: null, keyStage: "ks1" });

      const ks2 = findFuzzyMatch("ks2");
      expect(ks2).toMatchObject({ subject: null, keyStage: "ks2" });

      const ks3 = findFuzzyMatch("ks3");
      expect(ks3).toMatchObject({ subject: null, keyStage: "ks3" });

      const ks4 = findFuzzyMatch("ks4");
      expect(ks4).toMatchObject({ subject: null, keyStage: "ks4" });
    });
    it("should match key stage titles", () => {
      const ks1 = findFuzzyMatch("key stage 1");
      expect(ks1).toMatchObject({ subject: null, keyStage: "ks1" });

      const ks2 = findFuzzyMatch("key stage 2");
      expect(ks2).toMatchObject({ subject: null, keyStage: "ks2" });

      const ks3 = findFuzzyMatch("key stage 3");
      expect(ks3).toMatchObject({ subject: null, keyStage: "ks3" });

      const ks4 = findFuzzyMatch("key stage 4");
      expect(ks4).toMatchObject({ subject: null, keyStage: "ks4" });
    });
    it("should match with spaces", () => {
      const result = findFuzzyMatch("ks 1");
      expect(result).toMatchObject({ subject: null, keyStage: "ks1" });
    });
  });
  describe("years", () => {
    it.each([
      "year-1",
      "year-2",
      "year-3",
      "year-4",
      "year-5",
      "year-6",
      "year-7",
      "year-8",
      "year-9",
      "year-10",
      "year-11",
    ])(`matches year slug`, (year) => {
      const result = findFuzzyMatch(year);
      expect(result).toMatchObject({ year: year });
    });
    it.each([
      ["year-1", "Year 1"],
      ["year-2", "Year 2"],
      ["year-3", "Year 3"],
      ["year-4", "Year 4"],
      ["year-5", "Year 5"],
      ["year-6", "Year 6"],
      ["year-7", "Year 7"],
      ["year-8", "Year 8"],
      ["year-9", "Year 9"],
      ["year-10", "Year 10"],
      ["year-11", "Year 11"],
    ])(`matches year title`, (slug, title) => {
      const result = findFuzzyMatch(title);
      expect(result).toMatchObject({ year: slug });
    });
    it("matches with typos", () => {
      const result = findFuzzyMatch("yea 1");
      expect(result).toMatchObject({ year: "year-1" });

      const result2 = findFuzzyMatch("yr 5");
      expect(result2).toMatchObject({ year: "year-5" });
    });
    it.each([
      ["year1", "year-1"],
      ["year2", "year-2"],
      ["year3", "year-3"],
      ["year4", "year-4"],
      ["year5", "year-5"],
      ["year6", "year-6"],
      ["year7", "year-7"],
      ["year8", "year-8"],
      ["year9", "year-9"],
      ["year10", "year-10"],
      ["year11", "year-11"],
    ])("matches without spaces", (term, slug) => {
      const result = findFuzzyMatch(term);
      expect(result).toMatchObject({ year: slug });
    });
    it.each([
      ["year1", "year-1"],
      ["y2", "year-2"],
      ["y3", "year-3"],
      ["y4", "year-4"],
      ["y5", "year-5"],
      ["y6", "year-6"],
      ["y7", "year-7"],
      ["y8", "year-8"],
      ["y9", "year-9"],
      ["y10", "year-10"],
      ["y11", "year-11"],
    ])("matches short forms", (term, slug) => {
      const result = findFuzzyMatch(term);
      expect(result).toMatchObject({ year: slug });
    });
  });
  describe("examboards", () => {
    it.each(["aqa", "ocr", "edexcel", "eduqas", "edexcelb"])(
      "matches slugs",
      (term) => {
        const result = findFuzzyMatch(term);
        expect(result).toMatchObject({ examBoard: term });
      },
    );
    it.each([
      ["AQA", "aqa"],
      ["OCR", "ocr"],
      ["Edexcel", "edexcel"],
      ["Eduqas", "eduqas"],
      ["EdexcelB", "edexcelb"],
    ])("matches titles", (term, slug) => {
      const result = findFuzzyMatch(term);
      expect(result).toMatchObject({ examBoard: slug });
    });
  });
  describe("subjects and keystages", () => {
    it("matches on subject and keystage slugs", () => {
      const result = findFuzzyMatch("english ks4");
      expect(result).toMatchObject({
        subject: "english",
        keyStage: "ks4",
      });

      const result2 = findFuzzyMatch("maths ks2");
      expect(result2).toMatchObject({
        subject: "maths",
        keyStage: "ks2",
      });
    });
    it("matches on subject slug and keystage title", () => {
      const result = findFuzzyMatch("computing key stage 4");
      expect(result).toMatchObject({
        subject: "computing",
        keyStage: "ks4",
      });

      const result2 = findFuzzyMatch("art key stage 1");
      expect(result2).toMatchObject({
        subject: "art",
        keyStage: "ks1",
      });
    });
    it("matches on subject title and keystage title", () => {
      const result = findFuzzyMatch("Religious education key stage 3");
      expect(result).toMatchObject({
        subject: "religious-education",
        keyStage: "ks3",
      });

      const result2 = findFuzzyMatch("RSHE key stage 1");
      expect(result2).toMatchObject({
        subject: "rshe-pshe",
        keyStage: "ks1",
      });
    });
    it("matches partial subjects", () => {
      const result = findFuzzyMatch("englis ks3");
      expect(result).toMatchObject({ subject: "english", keyStage: "ks3" });
    });
    it("matches typos", () => {
      const result = findFuzzyMatch("ks2 georgaphy ");
      expect(result).toMatchObject({ subject: "geography", keyStage: "ks2" });
    });
    it("matches aliases", () => {
      const result = findFuzzyMatch("food tech ks4");
      expect(result).toMatchObject({
        subject: "cooking-nutrition",
        keyStage: "ks4",
      });
    });
  });
  describe("subjects and years", () => {
    it("matches on subject and years slugs", () => {
      const result = findFuzzyMatch("english year 1");
      expect(result).toMatchObject({
        subject: "english",
        year: "year-1",
      });

      const result2 = findFuzzyMatch("maths year 3");
      expect(result2).toMatchObject({
        subject: "maths",
        year: "year-3",
      });
    });
    it("matches on subject title and year", () => {
      const result = findFuzzyMatch("Religious education year 5");
      expect(result).toMatchObject({
        subject: "religious-education",
        year: "year-5",
      });

      const result2 = findFuzzyMatch("RSHE year11");
      expect(result2).toMatchObject({
        subject: "rshe-pshe",
        year: "year-11",
      });
    });
    it("matches partial subjects", () => {
      const result = findFuzzyMatch("englis y3");
      expect(result).toMatchObject({
        subject: "english",
        year: "year-3",
      });
    });
    it("matches typos", () => {
      const result = findFuzzyMatch("year2 georgaphy ");
      expect(result).toMatchObject({ subject: "geography", year: "year-2" });
    });
    it("matches subject aliases", () => {
      const result = findFuzzyMatch("food tech year 4");
      expect(result).toMatchObject({
        subject: "cooking-nutrition",
        year: "year-4",
      });
    });
  });
  describe("subjects and examboards", () => {
    it("matches on subject title and examboard", () => {
      const result = findFuzzyMatch("English aqa");
      expect(result).toMatchObject({
        subject: "english",
        examBoard: "aqa",
      });

      const result2 = findFuzzyMatch("history edexcel");
      expect(result2).toMatchObject({
        subject: "history",
        examBoard: "edexcel",
      });
    });
    it("matches partial subjects", () => {
      const result = findFuzzyMatch("englis ocr");
      expect(result).toMatchObject({
        subject: "english",
        examBoard: "ocr",
      });
    });
    it("matches typos", () => {
      const result = findFuzzyMatch("eduqas georgaphy ");
      expect(result).toMatchObject({
        subject: "geography",
        examBoard: "eduqas",
      });
    });
  });
});
