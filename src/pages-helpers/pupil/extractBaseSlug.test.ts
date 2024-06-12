import { extractBaseSlug } from "./extractBaseSlug";

interface ProgrammeData {
  programme_slug: string;
  base_slug: string;
}

const data: ProgrammeData[] = [
  {
    programme_slug: "music-secondary-year-7-l",
    base_slug: "music-secondary-year-7",
  },
  {
    programme_slug: "combined-science-secondary-year-11-foundation-edexcel",
    base_slug: "combined-science-secondary-year-11",
  },
  {
    programme_slug: "english-reading-for-pleasure-primary-year-6-l",
    base_slug: "english-reading-for-pleasure-primary-year-6",
  },
  {
    programme_slug:
      "personal-social-and-emotional-development-foundation-reception-l",
    base_slug: "personal-social-and-emotional-development-foundation-reception",
  },
  {
    programme_slug: "history-secondary-year-7-l",
    base_slug: "history-secondary-year-7",
  },
  {
    programme_slug: "drama-primary-year-1-l",
    base_slug: "drama-primary-year-1",
  },
  {
    programme_slug: "citizenship-secondary-year-11-l",
    base_slug: "citizenship-secondary-year-11",
  },
  {
    programme_slug: "art-primary-year-5-l",
    base_slug: "art-primary-year-5",
  },
  {
    programme_slug: "biology-secondary-year-10-foundation-aqa",
    base_slug: "biology-secondary-year-10",
  },
];

describe("getYearSlug", () => {
  it("should extract correct baseSlug from test examples", () => {
    data.forEach((element) => {
      expect(extractBaseSlug(element.programme_slug)).toBe(element.base_slug);
    });
  });
});
