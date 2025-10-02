import { getSuggestedFilters } from "./getSuggestedFilters";

const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      mockErrorReporter(...args),
}));
describe("getSuggestedFilters", () => {
  it("gets the correct suggested filters", () => {
    const res = getSuggestedFilters("maths", {
      subject: "maths",
      keyStage: null,
      year: null,
      examBoard: null,
    });
    expect(res).toEqual([
      { type: "key-stage", value: "early-years-foundation-stage" },
      { type: "key-stage", value: "ks1" },
      { type: "key-stage", value: "ks2" },
      { type: "key-stage", value: "ks3" },
      { type: "key-stage", value: "ks4" },
    ]);
  });
  it("does not get suggested filters when property is a direct match", () => {
    const res = getSuggestedFilters("english", {
      subject: "english",
      keyStage: "ks2",
      year: null,
      examBoard: null,
    });
    expect(res).toEqual([
      { type: "exam-board", value: "aqa" },
      { type: "exam-board", value: "edexcel" },
      { type: "exam-board", value: "eduqas" },
    ]);
  });
  it("throws an error when subject not found in data", () => {
    const res = getSuggestedFilters("classics", {
      subject: null,
      keyStage: null,
      examBoard: null,
      year: null,
    });
    expect(res).toEqual([]);
    expect(mockErrorReporter).toHaveBeenCalledWith(
      new Error("Invalid subject"),
      {
        severity: "warning",
        subject: "classics",
      },
    );
  });
});
