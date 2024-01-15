import { convertUnitSlugToTitle , removeHTMLTags } from ".";

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
});
