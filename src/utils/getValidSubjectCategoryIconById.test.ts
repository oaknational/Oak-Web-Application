import { getValidSubjectCategoryIconById } from "./getValidSubjectCategoryIconById";

describe("getValidSubjectCategoryIconById", () => {
  it("valid id", () => {
    expect(getValidSubjectCategoryIconById("english", "biology")).toEqual(
      "subject-biology",
    );
  });

  it("override 'reading-writing-and-oracy'", () => {
    expect(
      getValidSubjectCategoryIconById("english", "reading-writing-and-oracy"),
    ).toEqual("subject-english-reading-writing-oracy");
  });

  it("override 'literature'", () => {
    expect(getValidSubjectCategoryIconById("english", "literature")).toEqual(
      "subject-english-reading-for-pleasure",
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
