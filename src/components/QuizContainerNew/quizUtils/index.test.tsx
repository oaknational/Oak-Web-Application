import { removeMarkdown, shortAnswerTitleFormatter } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";


describe("shortAnswerTitleFormatter", () => {
  it("when passed an empty str returns an empty string", () => {
    const result = shortAnswerTitleFormatter("");
    expect(result).toBe("");
  });

  it("when passed null or undefined returns an empty string", () => {
    const nullResult = shortAnswerTitleFormatter(null);
    const undefinedResult = shortAnswerTitleFormatter(undefined);
    expect(nullResult).toBe("");
    expect(undefinedResult).toBe("");
  });

  it("when passed a string with no underscores returns the string", () => {
    const result = shortAnswerTitleFormatter("test title");
    expect(result).toBe("test title");
  });

  it("when passed a string with {{}} pattern returns the string with underscores component replacing the pattern", () => {
    const { getByTestId } = renderWithTheme(
      <>
        {shortAnswerTitleFormatter(
          "Given that a = 3b, fill in the gap: a + 3b = {{}}b."
        )}
      </>
    );
    expect(getByTestId("underline")).toBeInTheDocument();
  });

  it("when passed a string with {{some text}} pattern returns the string with underscores component replacing the pattern", () => {
    const { getByTestId } = renderWithTheme(
      <>
        {shortAnswerTitleFormatter(
          "Given that a = 3b, fill in the gap: a + 3b = {{hello!}}b."
        )}
      </>
    );
    expect(getByTestId("underline")).toBeInTheDocument();
  });
});

describe("removeMarkdown", () => {
  it("when passed an empty str returns an empty string", () => {
    const result = removeMarkdown("");
    expect(result).toBe("");
  });
  it("when passed null returns an empty string", () => {
    const result = removeMarkdown(null);
    expect(result).toBe("");
  });
  it("when passed undefined returns an empty string", () => {
    const result = removeMarkdown(undefined);
    expect(result).toBe("");
  });
  it("when passed string returns string without '*'s for this pattern - *text*", () => {
    const result = removeMarkdown("*text*");
    expect(result).toBe("text");
  });
  it("when passed string returns string without '*'s for this pattern - **text**", () => {
    const result = removeMarkdown("**text**");
    expect(result).toBe("text");
  });
  it("when passed string returns string without '*'s example question title", () => {
    const result = removeMarkdown(
      "Which of the following is **not** found in an animal cell"
    );
    expect(result).toBe(
      "Which of the following is not found in an animal cell"
    );
  });
  it("does not remove * on there own", () => {
    const result = removeMarkdown("300 * 100");
    expect(result).toBe("300 * 100");
  });
});
