import { getValidSubjectCategoryIconById } from "./getValidSubjectCategoryIconById";

describe("getValidSubjectCategoryIconById", () => {
  it("valid id", () => {
    expect(getValidSubjectCategoryIconById(1)).toEqual("subject-biology");
  });

  it("invalid id", () => {
    expect(getValidSubjectCategoryIconById(99)).toEqual("books");
  });
});
