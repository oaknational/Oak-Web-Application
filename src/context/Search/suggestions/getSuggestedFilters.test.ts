import { getSuggestedFiltersFromSubject } from "./getSuggestedFilters";

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
    const res = getSuggestedFiltersFromSubject("maths", {
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
  it("does not get suggested filters for ks when property is a direct match", () => {
    const res = getSuggestedFiltersFromSubject("english", {
      subject: "english",
      keyStage: "ks4",
      year: null,
      examBoard: null,
    });
    expect(res).toEqual([
      { type: "exam-board", value: "aqa" },
      { type: "exam-board", value: "edexcel" },
      { type: "exam-board", value: "eduqas" },
    ]);
  });
  it("suggests examboards when applicable keystage or year in direct match", () => {
    const res = getSuggestedFiltersFromSubject("geography", {
      subject: "geography",
      keyStage: "ks4",
      year: null,
      examBoard: null,
    });
    expect(res).toEqual([
      { type: "exam-board", value: "aqa" },
      { type: "exam-board", value: "edexcelb" },
    ]);
  });
  it("suggests examboards when year and keystage are null", () => {
    const res = getSuggestedFiltersFromSubject("geography", {
      subject: "geography",
      keyStage: null,
      year: null,
      examBoard: null,
    });
    expect(res).toEqual([
      { type: "key-stage", value: "ks1" },
      { type: "key-stage", value: "ks2" },
      { type: "key-stage", value: "ks3" },
      { type: "key-stage", value: "ks4" },
      { type: "exam-board", value: "aqa" },
      { type: "exam-board", value: "edexcelb" },
    ]);
  });
  it("should not return keystage options when year in direct match ", async () => {
    const res = getSuggestedFiltersFromSubject("maths", {
      subject: "maths",
      year: "year-1",
      keyStage: null,
      examBoard: null,
    });
    expect(res).toEqual([]);
  });
  it("throws an error when subject not found in data", () => {
    const res = getSuggestedFiltersFromSubject("classics", {
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
