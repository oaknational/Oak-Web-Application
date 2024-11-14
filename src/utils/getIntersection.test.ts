import { getIntersection } from "./getIntersection";

describe("getIntersection", () => {
  it("should return the intersection of an array of objects", () => {
    const arr = [
      { a: 1, b: 1, c: 3 },
      { a: 1, b: 2, c: 3 },
      { a: 1, b: 3, c: 2 },
    ];
    expect(getIntersection(arr)).toEqual({ a: 1 });
  });

  it("should return the intersection of an array of objects with nested objects", () => {
    const arr = [
      { exclusions: ["pupil"] },
      { exclusions: ["pupil"] },
      { exclusions: ["pupil"] },
    ];
    expect(getIntersection(arr)).toEqual({ exclusions: ["pupil"] });
  });

  it("should handle null values", () => {
    const arr = [{ a: 1, b: 1, c: 3 }, { a: 1, b: 2, c: 3 }, null];
    expect(getIntersection(arr)).toEqual({});
  });

  it("should handle null values in the initial position", () => {
    const arr = [null, { a: 1, b: 1, c: 3 }, { a: 1, b: 2, c: 3 }];
    expect(getIntersection(arr)).toEqual({});
  });
});
