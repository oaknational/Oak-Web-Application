import { resolveInputPath, wrapHtmlLayout } from "./helpers";

describe("wrapHtmlLayout", () => {
  it("wraps content with layout", () => {
    expect(wrapHtmlLayout("<p>Hello world</p>")).toMatchSnapshot();
  });
});

describe("outputPathFromLabel", () => {
  it("should work with valid label", () => {
    expect(resolveInputPath(":foo")).toEqual(
      `${process.cwd()}/scripts/dev/curriculum/output/screenshots/foo/`,
    );
    expect(resolveInputPath(":foo")).toEqual(
      `${process.cwd()}/scripts/dev/curriculum/output/screenshots/foo/`,
    );
  });

  it("should work with path", () => {
    expect(resolveInputPath("/foo/bar/")).toEqual(`/foo/bar/`);
    expect(resolveInputPath("/bar/baz/")).toEqual(`/bar/baz/`);
  });
});
