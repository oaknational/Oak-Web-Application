import { getValidSubjectCategoryIconById } from "./getValidSubjectCategoryIconById";

describe("getValidSubjectCategoryIconById", () => {
  it("valid id", () => {
    expect(getValidSubjectCategoryIconById("english", 1)).toEqual(
      "subject-biology",
    );
  });

  it("invalid id", () => {
    expect(getValidSubjectCategoryIconById("english", 99)).toEqual("books");
    expect(getValidSubjectCategoryIconById("foobar", -1)).toEqual("books");
  });

  it("'all' id", () => {
    expect(getValidSubjectCategoryIconById("english", -1)).toEqual(
      "subject-english",
    );
    expect(getValidSubjectCategoryIconById("religious-education", -1)).toEqual(
      "subject-religious-education",
    );
    expect(getValidSubjectCategoryIconById("science", -1)).toEqual(
      "subject-science",
    );
  });
});
