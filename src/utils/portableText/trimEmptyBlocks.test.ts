import { trimTrailingEmptyBlocks } from "./trimEmptyBlocks";

describe("trimTrailingEmptyBlocks", () => {
  it("returns null for null input", () => {
    expect(trimTrailingEmptyBlocks(null)).toBeNull();
  });

  it("returns null for undefined input", () => {
    expect(trimTrailingEmptyBlocks(undefined)).toBeNull();
  });

  it("returns null for empty array", () => {
    expect(trimTrailingEmptyBlocks([])).toBeNull();
  });

  it("returns null when all blocks are empty", () => {
    const blocks = [
      { _type: "block", children: [{ text: "" }] },
      { _type: "block", children: [{ text: "   " }] },
    ];
    expect(trimTrailingEmptyBlocks(blocks)).toBeNull();
  });

  it("returns original array when no trailing empty blocks", () => {
    const blocks = [
      { _type: "block", children: [{ text: "Hello" }] },
      { _type: "block", children: [{ text: "World" }] },
    ];
    expect(trimTrailingEmptyBlocks(blocks)).toBe(blocks);
  });

  it("removes trailing empty blocks", () => {
    const blocks = [
      { _type: "block", children: [{ text: "Content" }] },
      { _type: "block", children: [{ text: "" }] },
      { _type: "block", children: [{ text: "   " }] },
    ];
    const result = trimTrailingEmptyBlocks(blocks);
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      _type: "block",
      children: [{ text: "Content" }],
    });
  });

  it("preserves non-block types at the end", () => {
    const blocks = [
      { _type: "block", children: [{ text: "Content" }] },
      { _type: "image", asset: { url: "test.jpg" } },
    ];
    expect(trimTrailingEmptyBlocks(blocks)).toBe(blocks);
  });

  it("handles blocks with no children", () => {
    const blocks = [
      { _type: "block", children: [{ text: "Content" }] },
      { _type: "block", children: [] },
    ];
    const result = trimTrailingEmptyBlocks(blocks);
    expect(result).toHaveLength(1);
  });

  it("handles blocks with missing children property", () => {
    const blocks = [
      { _type: "block", children: [{ text: "Content" }] },
      { _type: "block" },
    ];
    const result = trimTrailingEmptyBlocks(blocks);
    expect(result).toHaveLength(1);
  });
});
