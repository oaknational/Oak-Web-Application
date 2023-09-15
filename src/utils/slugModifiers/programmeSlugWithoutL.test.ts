import programmeSlugWithoutL from "./programmeSlugWithoutL";

describe("programmeSlugWithoutL", () => {
  it("returns programme slug unmodified if it doesn't have suffix", () => {
    expect(programmeSlugWithoutL("chemistry-secondary-ks4")).toEqual(
      "chemistry-secondary-ks4",
    );
  });
  it("returns slug modified slug without -l if it does", () => {
    expect(programmeSlugWithoutL("chemistry-secondary-ks4-l")).toEqual(
      "chemistry-secondary-ks4",
    );
  });
});
