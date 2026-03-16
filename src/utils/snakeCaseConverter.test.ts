import snakeCaseConverter, { convertKey } from "./snakeCaseConverter";

describe("convertKey", () => {
  it("converts single underscore patterns to camelCase", () => {
    expect(convertKey("test_key")).toBe("testKey");
    expect(convertKey("another_test_key")).toBe("anotherTestKey");
  });

  it("handles strings without underscores unchanged", () => {
    expect(convertKey("test")).toBe("test");
    expect(convertKey("anotherTest")).toBe("anotherTest");
  });

  it("ignores keys prefixed with underscores", () => {
    expect(convertKey("_test")).toBe("_test");
    expect(convertKey("_another_test")).toBe("_another_test");
  });
});

describe("snakeCaseConverter", () => {
  it("converts object keys to camelCase", () => {
    const obj = { test_key: 1, another_test_key: 2, _underscore_test: 3 };
    const expectedResult = {
      testKey: 1,
      anotherTestKey: 2,
      _underscore_test: 3,
    };
    expect(snakeCaseConverter(obj)).toEqual(expectedResult);
  });

  it("handles nested objects", () => {
    const obj = { parent_key: { child_key: "value", _underscore_test: 3 } };
    const expectedResult = {
      parentKey: { childKey: "value", _underscore_test: 3 },
    };
    expect(snakeCaseConverter(obj)).toEqual(expectedResult);
  });

  it("converts keys within arrays of objects", () => {
    const arr = [
      { item_key: 1 },
      { another_item_key: 2 },
      { _underscore_test: 3 },
    ];
    const expectedResult = [
      { itemKey: 1 },
      { anotherItemKey: 2 },
      { _underscore_test: 3 },
    ];
    expect(snakeCaseConverter(arr)).toEqual(expectedResult);
  });

  it("leaves non-object/non-array types unchanged", () => {
    expect(snakeCaseConverter(123)).toBe(123);
    expect(snakeCaseConverter("test")).toBe("test");
    expect(snakeCaseConverter(null)).toBe(null);
  });

  it("handles arrays of primitive types unchanged", () => {
    const arr = [1, "test", true];
    expect(snakeCaseConverter(arr)).toEqual(arr);
  });

  it("works with complex nested structures", () => {
    const complexObj = {
      level_one: {
        level_two_array: [
          { level_three_key: "value1" },
          { level_three_key: "value2", _underscore_level_three: "value" },
        ],
        level_two_obj: {
          level_three_key: "value",
        },
      },
    };
    const expectedResult = {
      levelOne: {
        levelTwoArray: [
          { levelThreeKey: "value1" },
          { levelThreeKey: "value2", _underscore_level_three: "value" },
        ],
        levelTwoObj: {
          levelThreeKey: "value",
        },
      },
    };
    expect(snakeCaseConverter(complexObj)).toEqual(expectedResult);
  });
});
