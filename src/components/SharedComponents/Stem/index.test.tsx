import { stemToPortableText } from ".";

describe("stemToPortableText", () => {
  test("code & text", () => {
    const output = stemToPortableText(
      "This is some code ```const a = 3;``` and some more `//code`",
    );
    expect(output).toEqual([
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "This is some code " }],
      },
      { _type: "codeblock", text: "```const a = 3;```" },
      {
        _type: "block",
        style: "normal",
        children: [
          { _type: "span", text: " and some more " },
          { _type: "codeinline", text: "`//code`" },
        ],
      },
    ]);
  });

  test("math & text", () => {
    const output = stemToPortableText(
      "Which multiplier would match coefficients for either $$x$$ or $$y$$ for equations 1) $$5x + 4y = -13$$ and 2) $$10x + 2y = -44$$:",
    );
    expect(output.length).toEqual(1);
    expect(output[0]).toEqual({
      _type: "block",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "Which multiplier would match coefficients for either ",
        },
        expect.objectContaining({ _type: "math", text: "$$x$$" }),
        { _type: "span", text: " or " },
        expect.objectContaining({ _type: "math", text: "$$y$$" }),
        { _type: "span", text: " for equations 1) " },
        expect.objectContaining({ _type: "math", text: "$$5x + 4y = -13$$" }),
        { _type: "span", text: " and 2) " },
        expect.objectContaining({ _type: "math", text: "$$10x + 2y = -44$$" }),
        { _type: "span", text: ":" },
      ],
    });
  });

  test("text only", () => {
    const output = stemToPortableText("Give me $5 please");
    expect(output.length).toEqual(1);
    expect(output[0]).toEqual({
      _type: "block",
      style: "normal",
      children: [{ _type: "span", text: "Give me $5 please" }],
    });
  });

  test("code, math & text", () => {
    const output = stemToPortableText(
      "This is some code ```const a = 3;``` and some math $$x$$ cool eh?",
    );
    expect(output.length).toEqual(3);
    expect(output[0]).toEqual({
      _type: "block",
      style: "normal",
      children: [{ _type: "span", text: "This is some code " }],
    });
    expect(output[1]).toEqual({
      _type: "codeblock",
      text: "```const a = 3;```",
    });
    expect(output[2]).toEqual({
      _type: "block",
      style: "normal",
      children: [
        { _type: "span", text: " and some math " },
        expect.objectContaining({ _type: "math", text: "$$x$$" }),
        { _type: "span", text: " cool eh?" },
      ],
    });
  });
});
