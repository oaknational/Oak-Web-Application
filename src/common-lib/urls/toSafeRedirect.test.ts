import toSafeRedirect from "./toSafeRedirect";

describe(toSafeRedirect, () => {
  it("returns a full URL under base URL when a path is given", () => {
    expect(toSafeRedirect("/foo", new URL("http://example.com"))).toEqual(
      "http://example.com/foo",
    );
  });

  it("returns the origina URL if it matches the origin of safe base URL", () => {
    expect(
      toSafeRedirect("http://example.com/foo", new URL("http://example.com")),
    ).toEqual("http://example.com/foo");
  });

  it("returns undefined when the given URL is for an origin that does not match", () => {
    expect(
      toSafeRedirect("http://evil.com/foo", new URL("http://example.com")),
    ).toBeUndefined();
  });
});
