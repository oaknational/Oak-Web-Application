import { shortAnswerTitleFormatter } from "./index";

describe("shortAnswerTitleFormatter", () => {
  it("when passed an empty str returns an empty string", () => {
    const result = shortAnswerTitleFormatter("");
    expect(result).toBe("");
  });

  it("when passed a string with no {{}} returns the same string", () => {
    const result = shortAnswerTitleFormatter("This is a string");
    expect(result).toBe("This is a string");
  });

  it("when passed a string with one short answer {{}} field returns the string with an underline replacement", () => {
    const result = shortAnswerTitleFormatter("This is a {{}}");
    expect(result).toBe("This is a ___");
  });

  it("when passed a string with multiple short answers returns the same string", () => {
    const result = shortAnswerTitleFormatter(
      "This is a {{}} and this is a {{}}"
    );
    expect(result).toBe("This is a ___ and this is a ___");
  });
});
