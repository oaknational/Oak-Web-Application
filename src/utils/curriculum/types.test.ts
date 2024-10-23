import { notUndefined } from "./types";

describe("notUndefined", () => {
  it("true", () => {
    expect(notUndefined(undefined)).toEqual(false);
  });

  it("false", () => {
    expect(notUndefined(0)).toEqual(true);
    expect(notUndefined("")).toEqual(true);
    expect(notUndefined(false)).toEqual(true);
  });
});
