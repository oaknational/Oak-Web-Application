import { getValidSubjectCategoryIconById } from "./getValidSubjectCategoryIconById";

describe("getValidSubjectCategoryIconById", () => {
  it("valid id", () => {
    expect(getValidSubjectCategoryIconById("english", "biology")).toEqual(
      "subject-biology",
    );
  });

  it("invalid id", () => {
    expect(getValidSubjectCategoryIconById("english", "FOOBAR")).toEqual(
      "books",
    );
  });

  it("'all' id", () => {
    expect(getValidSubjectCategoryIconById("english", "all")).toEqual(
      "subject-english",
    );
    expect(
      getValidSubjectCategoryIconById("religious-education", "all"),
    ).toEqual("subject-religious-education");
    expect(getValidSubjectCategoryIconById("science", "all")).toEqual(
      "subject-science",
    );
  });
});
