import createQueryStringFromObject from "./createQueryStringFromObject";

describe("createQueryStringFromObject", () => {
  test("returns empty string if no query passed", () => {
    const result = createQueryStringFromObject();

    expect(result).toBe("");
  });
  test("should return correct string", () => {
    const result = createQueryStringFromObject({
      text: "macbeth",
      category: "oak-updates",
    });

    expect(result).toBe("text=macbeth&category=oak-updates");
  });
  test("should strip out null", () => {
    const result = createQueryStringFromObject({
      text: "macbeth",
      category: null,
    });

    expect(result).toBe("text=macbeth");
  });
  test("should strip out undefined", () => {
    const result = createQueryStringFromObject({
      text: "macbeth",
      category: undefined,
    });

    expect(result).toBe("text=macbeth");
  });
  test("should join string array with ',' delimeter", () => {
    const result = createQueryStringFromObject({
      text: "macbeth",
      categories: ["english", "theatre", "history"],
    });

    expect(result).toBe("text=macbeth&categories=english%2Ctheatre%2Chistory");
  });
});
