import { getSuggestedFilters } from "./getSuggestedFilters";

describe("getSuggestedFilters", () => {
  it("gets the correct suggested filters", () => {
    const res = getSuggestedFilters("maths", {
      subject: "maths",
      keyStage: null,
      year: null,
      examBoard: null,
    });
    expect(res).toEqual([
      { type: "key-stage", value: "ks1" },
      { type: "key-stage", value: "ks2" },
      { type: "key-stage", value: "ks3" },
      { type: "key-stage", value: "ks4" },
      { type: "key-stage", value: "early-years-foundation-stage" },
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
  it.todo("throws an error when subject not found in data");
});
