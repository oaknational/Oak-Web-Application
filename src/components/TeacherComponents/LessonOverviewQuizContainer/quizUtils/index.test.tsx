import {
  calcDims,
  constrainHeight,
  removeMarkdown,
  shortAnswerTitleFormatter,
} from ".";

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
    const { getByText } = renderWithTheme(
      <>{shortAnswerTitleFormatter("test title")}</>,
    );
    expect(getByText("test title")).toBeInTheDocument();
  });

  it("when passed a string with {{}} pattern returns the string with underscores component replacing the pattern", () => {
    const { getByTestId } = renderWithTheme(
      <>
        {shortAnswerTitleFormatter(
          "Given that a = 3b, fill in the gap: a + 3b = {{}}b.",
        )}
      </>,
    );
    expect(getByTestId("underline")).toBeInTheDocument();
  });

  it("when passed a string with {{some text}} pattern returns the string with underscores component replacing the pattern", () => {
    const { getByTestId } = renderWithTheme(
      <>
        {shortAnswerTitleFormatter(
          "Given that a = 3b, fill in the gap: a + 3b = {{hello!}}b.",
        )}
      </>,
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
      "Which of the following is **not** found in an animal cell",
    );
    expect(result).toBe(
      "Which of the following is not found in an animal cell",
    );
  });
  it("does not remove * on there own", () => {
    const result = removeMarkdown("300 * 100");
    expect(result).toBe("300 * 100");
  });
});

describe("constrainHeight", () => {
  it("when passed above 200 cap at 200", () => {
    const result = constrainHeight(300);
    expect(result).toBe(200);
  });
  it("when passed below 96 set to 96", () => {
    const result = constrainHeight(50);
    expect(result).toBe(96);
  });
  it("when passed undefined return undefined ", () => {
    const result = constrainHeight(undefined);
    expect(result).toBe(undefined);
  });
});

describe("calcDims", () => {
  it("when passed w and h return dims object", () => {
    const result = calcDims(300, 50);
    expect(result).toStrictEqual({ width: 576, height: 96 });
  });
  it("returns undefined dims object without width and height", () => {
    const result = calcDims(300);
    expect(result).toStrictEqual({ width: undefined, height: undefined });
  });
  it("returns undefined dims object when passed undefined ", () => {
    const result = calcDims();
    expect(result).toStrictEqual({ width: undefined, height: undefined });
  });
});
