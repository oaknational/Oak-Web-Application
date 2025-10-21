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
      subject: { slug: "maths", title: "Maths" },
      keyStage: null,
      year: null,
      examBoard: null,
    });

    expect(res).toEqual([
      { type: "key-stage", slug: "ks1", title: "Key Stage 1" },
      { type: "key-stage", slug: "ks2", title: "Key Stage 2" },
      { type: "key-stage", slug: "ks3", title: "Key Stage 3" },
      { type: "key-stage", slug: "ks4", title: "Key Stage 4" },
    ]);
  });
  it("does not get suggested filters for ks when property is a direct match", () => {
    const res = getSuggestedFiltersFromSubject("english", {
      subject: { slug: "english", title: "English" },
      keyStage: { slug: "ks4", title: "Key stage 4" },
      year: null,
      examBoard: null,
    });
    expect(res).toEqual([
      { type: "exam-board", slug: "aqa", title: "AQA" },
      { type: "exam-board", slug: "edexcel", title: "Edexcel" },
      { type: "exam-board", slug: "eduqas", title: "Eduqas" },
    ]);
  });
  it("suggests examboards when applicable keystage or year in direct match", () => {
    const res = getSuggestedFiltersFromSubject("geography", {
      subject: { slug: "geography", title: "Geography" },
      keyStage: { slug: "ks4", title: "Key stage 4" },
      year: null,
      examBoard: null,
    });

    expect(res).toEqual([
      { type: "exam-board", slug: "aqa", title: "AQA" },
      { type: "exam-board", slug: "edexcelb", title: "Edexcel B" },
    ]);
  });
  it("suggests examboards when year and keystage are null", () => {
    const res = getSuggestedFiltersFromSubject("geography", {
      subject: { slug: "geography", title: "Geography" },
      keyStage: null,
      year: null,
      examBoard: null,
    });

    expect(res).toEqual([
      { type: "key-stage", slug: "ks1", title: "Key Stage 1" },
      { type: "key-stage", slug: "ks2", title: "Key Stage 2" },
      { type: "key-stage", slug: "ks3", title: "Key Stage 3" },
      { type: "key-stage", slug: "ks4", title: "Key Stage 4" },
      { type: "exam-board", slug: "aqa", title: "AQA" },
      { type: "exam-board", slug: "edexcelb", title: "Edexcel B" },
    ]);
  });
  it("should not return keystage options when year in direct match ", async () => {
    const res = getSuggestedFiltersFromSubject("maths", {
      subject: { slug: "maths", title: "Maths" },
      year: { slug: "year-1", title: "Year 1" },
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
