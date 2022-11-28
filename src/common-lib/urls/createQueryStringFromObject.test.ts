import createQueryStringFromObject from "./createQueryStringFromObject";

describe("createQueryStringFromObject", () => {
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
});
