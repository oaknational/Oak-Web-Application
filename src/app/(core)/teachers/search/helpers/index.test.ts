import type { ParsedUrlQuery } from "querystring";

import {
  convertSearchIntentToFilters,
  convertUnitSlugToTitle,
  getActiveFilters,
  getFilterForQuery,
  getFiltersFromQuery,
  getFilterType,
  getHighlightFromAllFields,
  getLessonObject,
  getSortedSearchFiltersSelected,
  getUnitObject,
  isFilterItem,
  removeHTMLTags,
} from ".";

import { SearchIntent } from "@/common-lib/schemas/search-intent";
import { LEGACY_COHORT } from "@/config/cohort";
import {
  lessonSearchHitSchema,
  unitSearchHitSchema,
} from "@/context/Search/search.schema";
import { hitsFixture } from "@/context/Search/search-api/2023/searchResults.fixture";
import searchPageFixture from "@/node-lib/curriculum-api-2023/fixtures/searchPage.fixture";

const lessonHit = lessonSearchHitSchema.parse(
  hitsFixture.find((hit) => hit._source.type === "lesson"),
);

const unitHit = unitSearchHitSchema.parse(
  hitsFixture.find((hit) => hit._source.type === "unit"),
);

if (!lessonHit) {
  throw new Error("Cannot find a lesson result");
}
if (!unitHit) {
  throw new Error("Cannot find a unit result");
}

const unitHitTier = unitSearchHitSchema.parse(
  hitsFixture.find((hit) => hit._source.slug === "macbeth-a-tragic-hero"),
);

const lessonHitTier = lessonSearchHitSchema.parse(
  hitsFixture.find((hit) => hit._source.slug === "macbeth-the-tragic-hero"),
);

const allKeyStages = searchPageFixture().keyStages;

describe("search helpers", () => {
  it("getLessonObject maps to new key stage slug", () => {
    const lessonListObject = getLessonObject({
      hit: lessonHit,
      allKeyStages,
    });

    expect(lessonListObject?.keyStageSlug).toEqual("ks4");
  });

  it("getUnitObject maps to new key stage slug", () => {
    const unitListObject = getUnitObject({ hit: unitHit, allKeyStages });

    expect(unitListObject?.keyStageSlug).toEqual("ks4");
  });

  it("getProgrammeSlug returns a correct slug", () => {
    const unitListObjectLegacy = getUnitObject({
      hit: {
        ...unitHit,
        _source: { ...unitHit._source, cohort: LEGACY_COHORT },
      },
      allKeyStages,
    });
    const unitListObject = getUnitObject({ hit: unitHit, allKeyStages });
    const lessonListObject = getLessonObject({ hit: lessonHit, allKeyStages });
    const lessonListObjectLegacy = getLessonObject({
      hit: {
        ...lessonHit,
        _source: { ...lessonHit._source, cohort: LEGACY_COHORT },
      },
      allKeyStages,
    });
    expect(unitListObject?.buttonLinkProps.programmeSlug).toEqual(
      "english-secondary-ks4-eduqas",
    );
    expect(unitListObjectLegacy?.buttonLinkProps.programmeSlug).toEqual(
      "english-secondary-ks4-eduqas-l",
    );
    expect(lessonListObject?.buttonLinkProps.programmeSlug).toEqual(
      "english-secondary-ks4-eduqas",
    );
    expect(lessonListObjectLegacy?.buttonLinkProps.programmeSlug).toEqual(
      "english-secondary-ks4-eduqas-l",
    );
  });
  it("getProgrammeSlug returns a correct slug with tier", () => {
    const unitListObject = getUnitObject({ hit: unitHitTier, allKeyStages });
    const lessonListObject = getLessonObject({
      hit: lessonHitTier,
      allKeyStages,
    });
    expect(unitListObject?.buttonLinkProps.programmeSlug).toEqual(
      "english-secondary-ks4-eduqas",
    );
    expect(lessonListObject?.buttonLinkProps.programmeSlug).toEqual(
      "english-secondary-ks4-eduqas",
    );
  });
  it("legacy suffix is only added when legacy flag is true ", () => {
    const unitListObject = getUnitObject({
      hit: {
        ...unitHit,
        _source: { ...unitHit._source, cohort: LEGACY_COHORT },
      },
      allKeyStages,
    });
    const lessonListObject = getLessonObject({
      hit: {
        ...lessonHit,
        _source: { ...lessonHit._source, cohort: LEGACY_COHORT },
      },
      allKeyStages,
    });

    expect(unitListObject?.buttonLinkProps.programmeSlug).toEqual(
      "english-secondary-ks4-eduqas-l",
    );
    expect(lessonListObject?.buttonLinkProps.programmeSlug).toEqual(
      "english-secondary-ks4-eduqas-l",
    );
  });
  it("isFilterItem returns true if slug is a filter item", () => {
    expect(isFilterItem("ks2", allKeyStages)).toEqual(true);
  });
  it("isFilterItem returns false if slug is not filter item", () => {
    expect(isFilterItem("hello", allKeyStages)).toEqual(false);
  });
  it("getFilterForQuery return array from array", () => {
    expect(getFilterForQuery(["ks3", "ks2"], allKeyStages)).toEqual([
      "ks3",
      "ks2",
    ]);
  });
  it("getFilterForQuery return array from string", () => {
    expect(getFilterForQuery("ks2", allKeyStages)).toEqual(["ks2"]);
  });

  it("gets expected filters from query", () => {
    const query = {
      term: "macbeth",
      keyStages: "ks2",
      yearGroups: "year-4",
      subjects: "english-grammar",
      contentTypes: "lesson",
      examBoards: "wjec",
    } as ParsedUrlQuery;

    const result = getFiltersFromQuery(query);
    expect(result).toEqual([
      "ks2",
      "year-4",
      "lesson",
      "wjec",
      "english-grammar",
    ]);
  });
  it("gets expected filters from query with empty filters", () => {
    const query = { term: "macbeth" };
    const result = getFiltersFromQuery(query);
    expect(result).toEqual([]);
  });
  it("gets sorted filters with multiple filters", () => {
    const query = {
      term: "macbeth",
      keyStages: "ks2",
      subjects: "english-grammar",
      contentTypes: "lesson",
      examBoards: "wjec",
    } as ParsedUrlQuery;

    const result = getSortedSearchFiltersSelected(query);
    expect(result).toEqual(["english-grammar", "ks2", "lesson", "wjec"]);
  });
  it("getActiveFilters", () => {
    const query = {
      term: "macbeth",
      keyStages: "ks2,ks3,ks1",
      subjects: "english-grammar",
    };
    const result = getActiveFilters(query);
    expect(result).toEqual({
      keystages: "ks1,ks2,ks3",
      subjects: "english-grammar",
    });
  });
  it("getHighlightFromAllFields returns highlight when there is pupilLessonOutcome", () => {
    const rawHighlight = { pupilLessonOutcome: ["<b>Outcome</b>"] };
    const highlight = getHighlightFromAllFields(rawHighlight, "Outcome");
    expect(highlight).toBe(rawHighlight);
  });
  it("getHighlightFromAllFields transforms highlight from all fields with a single value", () => {
    const rawHighlight = { all_fields: ["<b>Outcome</b>"] };
    const highlight = getHighlightFromAllFields(rawHighlight, "Outcome");
    expect(highlight).toEqual({ pupilLessonOutcome: ["<b>Outcome</b>"] });
  });
  it("getHighlightFromAllFields transforms highlight from all fields with multiple values", () => {
    const rawHighlight = {
      all_fields: [
        "I can describe the relationship between <b>Macbeth</b> and Lady <b>Macbeth</b>.",
        "<b>Macbeth</b>: Lady <b>Macbeth</b> as a machiavellian villain",
        "The relationship between <b>Macbeth</b> and Lady <b>Macbeth</b>",
      ],
    };
    const highlight = getHighlightFromAllFields(
      rawHighlight,
      "I can describe the relationship between Macbeth and Lady Macbeth.",
    );
    expect(highlight).toEqual({
      pupilLessonOutcome: [
        "I can describe the relationship between <b>Macbeth</b> and Lady <b>Macbeth</b>.",
      ],
    });
  });
  it("getHighlightFromAllFields returns undefined if no match found in all fields or pupilLessonOutcome", () => {
    const rawHighlight = {
      all_fields: ["not a match", "<b>not a match</b>"],
    };
    const highlight = getHighlightFromAllFields(rawHighlight, "a match");
    expect(highlight).toBeUndefined();
  });
  describe("convertSearchIntentToFilters", () => {
    it("it returns undefined if no suggested filters", () => {
      const result = convertSearchIntentToFilters();
      expect(result).toBeUndefined();
    });
    it("it returns expected suggested filters for directMatch match", () => {
      const searchIntent: SearchIntent = {
        directMatch: {
          subject: { slug: "maths", title: "Maths" },
          keyStage: { slug: "ks2", title: "Ks2" },
          examBoard: { slug: "aqa", title: "Aqa" },
          year: null,
        },
        suggestedFilters: [],
      };
      const result = convertSearchIntentToFilters(searchIntent);
      expect(result).toEqual([
        {
          type: "subject",
          slug: "maths",
          value: "Maths",
          source: "fuzzy_match",
        },
        { type: "key-stage", slug: "ks2", value: "Ks2", source: "fuzzy_match" },
        {
          type: "exam-board",
          slug: "aqa",
          value: "Aqa",
          source: "fuzzy_match",
        },
      ]);
    });
    it("it returns expected suggested filters for directMatch with suggestions", () => {
      const searchIntent: SearchIntent = {
        directMatch: {
          subject: { slug: "maths", title: "Maths" },
          keyStage: null,
          examBoard: null,
          year: { slug: "year-1", title: "Year 1" },
        },
        suggestedFilters: [
          { type: "key-stage", slug: "ks2", title: "Ks2" },
          { type: "exam-board", slug: "aqa", title: "Aqa" },
        ],
      };
      const result = convertSearchIntentToFilters(searchIntent);
      expect(result).toEqual([
        {
          type: "subject",
          slug: "maths",
          value: "Maths",
          source: "fuzzy_match",
        },
        { type: "key-stage", slug: "ks2", value: "Ks2", source: "ai" },
        {
          type: "year",
          slug: "year-1",
          value: "Year 1",
          source: "fuzzy_match",
        },
        { type: "exam-board", slug: "aqa", value: "Aqa", source: "ai" },
      ]);
    });
    it("it returns expected suggested filters in the correct order, subject, ks, year, exam", () => {
      const searchIntent: SearchIntent = {
        directMatch: null,
        suggestedFilters: [
          { type: "exam-board", slug: "aqa", title: "Aqa" },
          { type: "key-stage", slug: "ks2", title: "Ks2" },
          { type: "subject", slug: "history", title: "History" },
          { type: "subject", slug: "maths", title: "Maths" },
          { type: "year", slug: "year-1", title: "Year 1" },
        ],
      };
      const result = convertSearchIntentToFilters(searchIntent);
      expect(result).toEqual([
        { type: "subject", slug: "history", value: "History", source: "ai" },
        { type: "subject", slug: "maths", value: "Maths", source: "ai" },
        { type: "key-stage", slug: "ks2", value: "Ks2", source: "ai" },
        { type: "year", slug: "year-1", value: "Year 1", source: "ai" },
        { type: "exam-board", slug: "aqa", value: "Aqa", source: "ai" },
      ]);
    });
    it("it removes any duplicates", () => {
      const searchIntent: SearchIntent = {
        directMatch: null,
        suggestedFilters: [
          { type: "exam-board", slug: "aqa", title: "Aqa" },
          { type: "key-stage", slug: "ks2", title: "Ks2" },
          { type: "key-stage", slug: "ks2", title: "Ks2" },
          { type: "subject", slug: "history", title: "History" },
          { type: "subject", slug: "maths", title: "Maths" },
          { type: "year", slug: "year-1", title: "Year 1" },
        ],
      };
      const result = convertSearchIntentToFilters(searchIntent);
      expect(result).toEqual([
        { type: "subject", slug: "history", value: "History", source: "ai" },
        { type: "subject", slug: "maths", value: "Maths", source: "ai" },
        { type: "key-stage", slug: "ks2", value: "Ks2", source: "ai" },
        { type: "year", slug: "year-1", value: "Year 1", source: "ai" },
        { type: "exam-board", slug: "aqa", value: "Aqa", source: "ai" },
      ]);
    });
  });
  describe("convertSlugToTitle", () => {
    it("should convert a slug to title", () => {
      const slug = "the-oral-tradition-7424";
      const title = convertUnitSlugToTitle(slug);
      expect(title).toBe("The Oral Tradition");
    });

    it("should handle a slug with all lowercase letters", () => {
      const slug = "imperative-tense-3042";
      const title = convertUnitSlugToTitle(slug);
      expect(title).toBe("Imperative Tense");
    });

    it("should handle a slug with mixed case letters", () => {
      const slug = "surds-and-fractions-02032";
      const title = convertUnitSlugToTitle(slug);
      expect(title).toBe("Surds And Fractions");
    });

    it("should handle a slug with mixed case letters and numbers mid sentence", () => {
      const slug = "year-7-surds-and-fractions-d02032";
      const title = convertUnitSlugToTitle(slug);
      expect(title).toBe("Year 7 Surds And Fractions");
    });
  });

  describe("removeHTMLTags", () => {
    it("should strip HTML tags from a string", () => {
      const string = "<h1>hello</h1>";
      expect(removeHTMLTags(string)).toBe("hello");
    });

    it("should strip HTML tags with properties from a string", () => {
      const string = "<script someproperty=true>hello</script>";
      expect(removeHTMLTags(string)).toBe("hello");
    });
  });

  describe("getFilterType", () => {
    it("should return keystage filter for valid ks", () => {
      const result = getFilterType("ks2");
      expect(result).toBe("Key stage filter");
    });
    it("should return year filter for valid year", () => {
      const result = getFilterType("year-2");
      expect(result).toBe("Year filter");
    });
    it("should return subject filter for valid subject", () => {
      const result = getFilterType("maths");
      expect(result).toBe("Subject filter");
    });
    it("should return content type filter for valid content type", () => {
      const result = getFilterType("unit");
      expect(result).toBe("Content type filter");
    });
    it("should return cohort filter for new slug", () => {
      const result = getFilterType("new");
      expect(result).toBe("Lesson Cohort filter");
    });
    it("should return unkown filter for invalid slug", () => {
      const result = getFilterType("not-a-slug");
      expect(result).toBe("Unknown filter");
    });
  });
});
