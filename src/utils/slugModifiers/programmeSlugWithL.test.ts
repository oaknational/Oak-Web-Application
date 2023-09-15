import programmeSlugWithL from "./programmeSlugWithL";

describe("programmeSlugWith-l", () => {
  it("returns programme slug with '-l' suffix", () => {
    expect(programmeSlugWithL("chemistry-secondary-ks4")).toEqual(
      "chemistry-secondary-ks4-l",
    );
  });
  it("returns undefined if no slug is passed in", () => {
    expect(programmeSlugWithL()).toEqual(undefined);
  });
  it("returns undefined if null is passed in", () => {
    expect(programmeSlugWithL(null)).toEqual(undefined);
  });
  it("returns slug unmodified if it is already legacy slug", () => {
    expect(programmeSlugWithL("chemistry-secondary-ks4-l")).toEqual(
      "chemistry-secondary-ks4-l",
    );
  });
});
