import OakError from "./OakError";

describe("errors/OakError", () => {
  it("should include a stack trace", () => {
    const error = new OakError({ code: "misc/unknown" });

    expect(error.stack).toContain("Error: An unknown error has occurred");
  });
  it("should get the correct error message", () => {
    const error = new OakError({ code: "auth/token-error-unknown" });

    expect(error.message).toBe("Could not verify token");
  });
  it("should be an instance of Error", () => {
    const error = new OakError({ code: "misc/unknown" });
    expect(error).toBeInstanceOf(Error);
  });
  it("should store custom metadata", () => {
    const error = new OakError({ code: "misc/unknown", meta: { foo: "bar" } });

    expect(error.meta).toMatchObject({ foo: "bar" });
  });
  it("should store the error config object", () => {
    const error = new OakError({ code: "misc/unknown" });

    expect(error.config).toMatchObject({
      message: "An unknown error has occurred",
      responseStatusCode: 500,
      shouldNotify: true,
    });
  });
});
