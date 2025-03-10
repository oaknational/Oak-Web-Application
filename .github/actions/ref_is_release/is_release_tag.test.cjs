const isReleaseTag = require("./is_release_tag.cjs");

const branchRef = "refs/heads/some_branch";
const nonReleaseTagRef = "refs/tags/some_tag";
const prodReleaseTag = "refs/tags/v12.3.456";

describe("isReleaseTag is", () => {
  it("false for branches", () => {
    expect(isReleaseTag(branchRef)).toBe(false);
  });
  it("false for non-release tags", () => {
    expect(isReleaseTag(nonReleaseTagRef)).toBe(false);
  });
  it("true for release tags", () => {
    expect(isReleaseTag(prodReleaseTag)).toBe(true);
  });
});
