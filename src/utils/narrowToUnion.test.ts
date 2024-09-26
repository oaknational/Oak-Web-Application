import { isInUnion, throwIfNotInUnion, unionOrNull } from "./narrowToUnion";

describe("narrowToUnion", () => {
  describe("isInUnion", () => {
    it("returns true if the candidate is in the union", () => {
      expect(isInUnion("a", ["a", "b", "c"])).toBe(true);
    });
    it("returns false if the candidate is not in the union", () => {
      expect(isInUnion("d", ["a", "b", "c"])).toBe(false);
    });
  });

  describe("throwIfNotInUnion", () => {
    it("throws if the candidate is null", () => {
      expect(() => throwIfNotInUnion(null, ["a", "b", "c"])).toThrow(
        "Value is null or undefined",
      );
    });
    it("throws if the candidate is not in the union", () => {
      expect(() => throwIfNotInUnion("d", ["a", "b", "c"])).toThrow(
        "Value d not in a,b,c",
      );
    });
    it("does not throw if the candidate is in the union", () => {
      expect(() => throwIfNotInUnion("a", ["a", "b", "c"])).not.toThrow();
    });
  });

  describe("unionOrNull", () => {
    it("returns the candidate if it is in the union", () => {
      expect(unionOrNull("a", ["a", "b", "c"])).toBe("a");
    });
    it("returns null if the candidate is not in the union", () => {
      expect(unionOrNull("d", ["a", "b", "c"])).toBeNull();
    });
    it("returns null if the candidate is null", () => {
      expect(unionOrNull(null, ["a", "b", "c"])).toBeNull();
    });
  });
});
