import { getIdFromSlug } from "./helper";

it("getIdFromSlug", () => {
  const map = new Map();
  const result1 = getIdFromSlug(map, "foo");
  expect(result1).toEqual(1);
  const result2 = getIdFromSlug(map, "foo");
  expect(result2).toEqual(1);
  const result3 = getIdFromSlug(map, "bar");
  expect(result3).toEqual(2);
});
