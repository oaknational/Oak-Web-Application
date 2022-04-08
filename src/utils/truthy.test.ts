import truthy from "./truthy";
/**
 * Note this function is really just for types, which we're not testing here
 */
describe("utils/truthy.ts", () => {
  it("should return true for truthy values", () => {
    expect(truthy("test")).toBe(true);
    expect(truthy(1)).toBe(true);
    expect(truthy([])).toBe(true);
    expect(truthy({})).toBe(true);
  });
  it("should return false for falsy values", () => {
    expect(truthy("")).toBe(false);
    expect(truthy(false)).toBe(false);
    expect(truthy(0)).toBe(false);
  });
});
