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
});
