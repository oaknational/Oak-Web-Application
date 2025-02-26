import {
  getIdFromSlug,
  getLessonUidFromSlug,
  getTitleFromSlug,
} from "./helper";

it("getIdFromSlug", () => {
  const map = new Map();
  const result1 = getIdFromSlug(map, "foo");
  expect(result1).toEqual(1);
  const result2 = getIdFromSlug(map, "foo");
  expect(result2).toEqual(1);
  const result3 = getIdFromSlug(map, "bar");
  expect(result3).toEqual(2);
});

it("getTitleFromSlug", () => {
  expect(getTitleFromSlug("hello")).toEqual("Hello");
  expect(getTitleFromSlug("hello-world")).toEqual("Hello world");
});

describe("getLessonUidFromSlug", () => {
  it("basic", () => {
    const map = new Map();
    expect(getLessonUidFromSlug(map, "test")).toEqual("LESS-TEST-1");
    expect(getLessonUidFromSlug(map, "foobar")).toEqual("LESS-TEST-2");
    expect(getLessonUidFromSlug(map, "test")).toEqual("LESS-TEST-1");
  });
});
