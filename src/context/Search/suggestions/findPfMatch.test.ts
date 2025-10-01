import { findPfMatch } from "./findPfMatch";
import { OAK_KEYSTAGES, OAK_SUBJECTS, OAK_YEARS } from "./oakCurriculumData";

describe("findFuzzyMatch", () => {
  it("should return null for empty query", () => {
    expect(findPfMatch("")).toBeNull();
  });

  it("should return null for whitespace-only query", () => {
    expect(findPfMatch("   ")).toBeNull();
  });

  it("should return null for single character query", () => {
    expect(findPfMatch("h")).toBeNull();
  });

  it("should return null for queries that don't match any subject", () => {
    expect(findPfMatch("xyzzyx")).toBeNull();
  });

  it.each([
    "the history of mathematics in ancient greece",
    "the geography of the nile river",
    "history world war 2",
    "Churchill’s history of the 20th century",
    "war of the worlds in art and film",
    "biology gone bad: when bacteria attack",
  ])("should not match longer strings with subjects in them %p", (term) => {
    const result = findPfMatch(term);
    expect(result?.subject).toBeFalsy();
  });
  describe("keystages", () => {
    it.each(OAK_KEYSTAGES.map((ks) => ks.slug))(
      "should match keystage slugs",
      (slug) => {
        const result = findPfMatch(slug);
        expect(result).toMatchObject({ keyStage: slug });
      },
    );
    it.each(OAK_KEYSTAGES.map((ks) => [ks.title, ks.slug]))(
      "should match key stage titles %p",
      (title, slug) => {
        const result = findPfMatch(title);
        expect(result).toMatchObject({ keyStage: slug });
      },
    );
  });
  describe("years", () => {
    it.each(OAK_YEARS.map((y) => y.slug))(`matches year slug %p`, (year) => {
      const result = findPfMatch(year);
      expect(result).toMatchObject({ year: year });
    });
    it.each(OAK_YEARS.map((y) => [y.title, y.slug]))(
      `matches year title %p`,
      (title, slug) => {
        const result = findPfMatch(title);
        expect(result).toMatchObject({ year: slug });
      },
    );
    const yearsWithAliases = OAK_YEARS.filter(
      (y) => y.aliases && y.aliases.length > 0,
    ).map((y) => [y.aliases, y.slug]);
    it.each(yearsWithAliases)(
      "should match year aliases %p",
      (aliases, slug) => {
        if (aliases && typeof aliases !== "string") {
          aliases?.forEach((alias: string) => {
            const result = findPfMatch(alias);
            expect(result).toMatchObject({ year: slug });
          });
        }
      },
    );
  });
  describe("examboards", () => {
    it.each(["aqa", "ocr", "edexcel", "eduqas", "edexcelb"])(
      "matches slugs",
      (term) => {
        const result = findPfMatch(term);
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
      const result = findPfMatch(term);
      expect(result).toMatchObject({ examBoard: slug });
    });
  });
  describe("subjects and keystages", () => {
    const subjectsWithKeystageTitles = OAK_SUBJECTS.map((subject) =>
      subject.keyStages.map((ks) => [
        `${ks.title} ${subject.title}`,
        ks.slug,
        subject.slug,
      ]),
    ).flat();
    const subjectsWithKeystageSlugs = OAK_SUBJECTS.map((subject) =>
      subject.keyStages.map((ks) => [
        `${ks.slug} ${subject.title}`,
        ks.slug,
        subject.slug,
      ]),
    ).flat();
    it.each(subjectsWithKeystageSlugs)(
      "matches on subject and keystage slugs",
      (query, keyStage, subject) => {
        const result = findPfMatch(query);
        expect(result).toMatchObject({
          subject,
          keyStage,
        });
      },
    );
    it.each(subjectsWithKeystageTitles)(
      "matches on subject slug and keystage title",
      (query, keyStage, subject) => {
        const result = findPfMatch(query);
        expect(result).toMatchObject({
          subject,
          keyStage,
        });
      },
    );
    it("matches aliases", () => {
      const result = findPfMatch("food tech ks4");
      expect(result).toMatchObject({
        subject: "cooking-nutrition",
        keyStage: "ks4",
      });
    });
  });
  describe("subjects and years", () => {
    const subjectsWithYearSlugs = OAK_SUBJECTS.map((subject) =>
      subject.years.map((y) => [
        `${y.slug} ${subject.title}`,
        y.slug,
        subject.slug,
      ]),
    ).flat();
    it.each(subjectsWithYearSlugs)(
      "matches on subject and years slugs %p",
      (query, year, subject) => {
        const result = findPfMatch(query);
        expect(result).toMatchObject({
          subject,
          year,
        });
      },
    );
  });
  describe("subjects and examboards", () => {
    const subjectsWithExamBoards = OAK_SUBJECTS.filter(
      (subject) => subject.examBoards.length > 0,
    )
      .map((subject) =>
        subject.examBoards.map((eb) => [
          `${eb.title} ${subject.title}`,
          eb.slug,
          subject.slug,
        ]),
      )
      .flat();
    it.each(subjectsWithExamBoards)(
      "matches on subject title and examboard %p",
      (term, examBoard, subject) => {
        const result = findPfMatch(term);
        expect(result).toMatchObject({
          subject,
          examBoard,
        });
      },
    );
  });
  describe("combinations of all pfs", () => {
    const subjectsWithExamboardsByKs = OAK_SUBJECTS.filter(
      (subject) => subject.examBoards.length > 0,
    )
      .map((subject) =>
        subject.examBoards.map((eb) => [
          `${eb.title} ${subject.title} ks4`,
          eb.slug,
          subject.slug,
        ]),
      )
      .flat();

    const subjectsWithExamboardsByYear = OAK_SUBJECTS.filter(
      (subject) => subject.examBoards.length > 0,
    )
      .map((subject) =>
        subject.examBoards.flatMap((eb) => [
          [
            `${eb.title} ${subject.title} year 10`,
            eb.slug,
            subject.slug,
            "year-10",
          ],
          [
            `${eb.title} ${subject.title} year 11`,
            eb.slug,
            subject.slug,
            "year-11",
          ],
        ]),
      )
      .flat();

    it.each(subjectsWithExamboardsByKs)(
      "can handle %p",
      (term, examBoard, subject) => {
        const result = findPfMatch(term);
        expect(result).toMatchObject({
          subject,
          keyStage: "ks4",
          examBoard,
        });
      },
    );
    it.each(subjectsWithExamboardsByYear)(
      "can handle %p",
      (term, examBoard, subject, year) => {
        const result = findPfMatch(term);
        expect(result).toMatchObject({
          subject,
          year,
          examBoard,
        });
      },
    );
    it.each([
      "how to teach ks4 geography in france",
      "year 1 class about how to read music ",
      "whats a good ocr curriculum for ks3 students about macbeth",
      "the history of art in 19th century spain",
      "the great depression ks4 history aqa",
    ])(
      "returns null when multiple terms are included in a longer sentence",
      (term) => {
        const result = findPfMatch(term);
        expect(result).toBeNull();
      },
    );
  });
});
