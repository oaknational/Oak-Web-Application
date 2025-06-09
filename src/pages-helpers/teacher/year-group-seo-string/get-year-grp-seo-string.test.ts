import getYearGroupSEOString from "./get-year-grp-seo-string";

describe("getYearGroupSEOString", () => {
  test("return empty string for an empty array", () => {
    const result = getYearGroupSEOString([]);
    expect(result).toBe("");
  });
  test("return correct string for a single year group", () => {
    const result = getYearGroupSEOString([
      {
        year: "1",
        yearTitle: "Year 1",
        yearSlug: "year-1",
      },
    ]);
    expect(result).toBe("Y 1");
  });
  test("return correct string for two year groups", () => {
    const result = getYearGroupSEOString([
      {
        year: "1",
        yearTitle: "Year 1",
        yearSlug: "year-1",
      },
      {
        year: "2",
        yearTitle: "Year 2",
        yearSlug: "year-2",
      },
    ]);
    expect(result).toBe("Y 1 & 2");
  });
  test("return correct string for multiple year groups", () => {
    const result = getYearGroupSEOString([
      {
        year: "1",
        yearTitle: "Year 1",
        yearSlug: "year-1",
      },
      {
        year: "2",
        yearTitle: "Year 2",
        yearSlug: "year-2",
      },
      {
        year: "3",
        yearTitle: "Year 3",
        yearSlug: "year-3",
      },
    ]);
    expect(result).toBe("Y 1, 2, & 3");
  });
  test("handles reception year correctly", () => {
    const result = getYearGroupSEOString([
      {
        year: "R",
        yearTitle: "Reception",

        yearSlug: "reception",
      },

      {
        year: "1",
        yearTitle: "Year 1",
        yearSlug: "year-1",
      },

      {
        year: "2",
        yearTitle: "Year 2",
        yearSlug: "year-2",
      },
    ]);
    expect(result).toBe("Y R, 1, & 2");
  });
});
