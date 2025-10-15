import { convertUnitSlugToTitle, getFilterType, removeHTMLTags } from ".";

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
