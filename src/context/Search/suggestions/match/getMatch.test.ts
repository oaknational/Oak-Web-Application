import { OAK_SUBJECTS } from "../oakCurriculumData";

import { getMatch } from "./getMatch";

describe("getMatch", () => {
  it.each(OAK_SUBJECTS.map((s) => [s.title, s.slug]))(
    "should match on title",
    (title, slug) => {
      const result = getMatch(title, OAK_SUBJECTS);
      expect(result?.slug).toBe(slug);
    },
  );
  it.each(OAK_SUBJECTS.map((s) => s.slug))("should match on slug", (slug) => {
    const result = getMatch(slug, OAK_SUBJECTS);
    expect(result?.slug).toBe(slug);
  });
  it.each(OAK_SUBJECTS.map((s) => [s.title.toUpperCase(), s.slug]))(
    "should match case-insensitive queries",
    (title, slug) => {
      const result = getMatch(title, OAK_SUBJECTS);
      expect(result?.slug).toBe(slug);
    },
  );
  const subjectsWithAliases = OAK_SUBJECTS.filter(
    (s) => s.aliases && s.aliases.length > 0,
  ).map((s) => [s.aliases, s.slug]);

  it.each(subjectsWithAliases)("should match aliases %p", (aliases, slug) => {
    if (aliases && typeof aliases !== "string") {
      aliases?.forEach((alias: string) => {
        const result = getMatch(alias, OAK_SUBJECTS);
        expect(result?.slug).toBe(slug);
      });
    }
  });
});
