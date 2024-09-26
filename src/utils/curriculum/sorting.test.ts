import { sortYears } from "./sorting";

describe("sortYears", () => {
  it("basic numbers", () => {
    expect(["8", "7", "9", "11", "10"].sort(sortYears)).toEqual([
      "7",
      "8",
      "9",
      "10",
      "11",
    ]);
  });

  it("with all-years", () => {
    expect(["all-years", "8", "7", "9", "11", "10"].sort(sortYears)).toEqual([
      "all-years",
      "7",
      "8",
      "9",
      "10",
      "11",
    ]);
  });
});
