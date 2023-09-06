import handleFetchError from "./handleFetchError";

describe("handleFetchError()", () => {
  it("should should not throw if response good", () => {
    expect(() => handleFetchError({ ok: true } as Response)).not.toThrow();
  });
  it("should throw with the statustext", () => {
    expect(() =>
      handleFetchError({ ok: false, statusText: "Bad thing" } as Response),
    ).toThrow("Bad thing");
  });
});
