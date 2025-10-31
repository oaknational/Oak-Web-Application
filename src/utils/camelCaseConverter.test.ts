import camelCaseConverter, {
  convertKeyToSnakeCase,
} from "./camelCaseConverter";

describe("convertKeyToSnakeCase", () => {
  it("converts single underscore patterns to camelCase", () => {
    expect(convertKeyToSnakeCase("testKey")).toBe("test_key");
    expect(convertKeyToSnakeCase("anotherTestKey")).toBe("another_test_key");
  });

  it("handles strings without capitalisation unchanged", () => {
    expect(convertKeyToSnakeCase("test")).toBe("test");
    expect(convertKeyToSnakeCase("another_test")).toBe("another_test");
  });
});

describe("camelCaseConverter", () => {
  it("converts object keys to snakeCase", () => {
    const obj = { testKey: 1, anotherTestKey: 2 };
    const expectedResult = { test_key: 1, another_test_key: 2 };
    expect(camelCaseConverter(obj)).toEqual(expectedResult);
  });

  it("handles nested objects", () => {
    const obj = { parentKey: { childKey: "value" } };
    const expectedResult = { parent_key: { child_key: "value" } };
    expect(camelCaseConverter(obj)).toEqual(expectedResult);
  });

  it("converts keys within arrays of objects", () => {
    const arr = [{ itemKey: 1 }, { anotherItemKey: 2 }];
    const expectedResult = [{ item_key: 1 }, { another_item_key: 2 }];
    expect(camelCaseConverter(arr)).toEqual(expectedResult);
  });

  it("leaves non-object/non-array types unchanged", () => {
    expect(camelCaseConverter(123)).toBe(123);
    expect(camelCaseConverter("test")).toBe("test");
    expect(camelCaseConverter(null)).toBe(null);
  });

  it("handles arrays of primitive types unchanged", () => {
    const arr = [1, "test", true];
    expect(camelCaseConverter(arr)).toEqual(arr);
  });

  it("works with complex nested structures", () => {
    const complexObj = {
      levelOne: {
        levelTwoArray: [
          { levelThreeKey: "value1" },
          { levelThreeKey: "value2" },
        ],
        levelTwoObj: {
          levelThreeKey: "value",
        },
      },
    };
    const expectedResult = {
      level_one: {
        level_two_array: [
          { level_three_key: "value1" },
          { level_three_key: "value2" },
        ],
        level_two_obj: {
          level_three_key: "value",
        },
      },
    };
    expect(camelCaseConverter(complexObj)).toEqual(expectedResult);
  });
});
