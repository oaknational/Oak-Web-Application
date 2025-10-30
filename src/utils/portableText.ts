import convertToMml from "@/utils/mathjax";

type PortableTextSpan = { _type: "span"; text: string };
type PortableTextText = {
  _type: "block";
  style: string;
  children: (
    | PortableTextMath
    | PortableTextSpan
    | PortableTextCodeInline
    | PortableAnswerSpace
  )[];
};
type PortableTextCodeBlock = { _type: "codeblock"; text: string };
type PortableTextCodeInline = { _type: "codeinline"; text: string };
type PortableTextMath = { _type: "math"; text: string; html: string };
type PortableAnswerSpace = { _type: "answer_space" };
export type PortableTextItem =
  | PortableTextText
  | PortableTextCodeBlock
  | PortableTextSpan
  | PortableAnswerSpace;

// Note: this mutates the input array
function lastBlockOrNewBlock(out: PortableTextItem[], style = "normal") {
  const lastItem = out.at(-1);
  if (lastItem && lastItem._type === "block") {
    return lastItem;
  } else {
    const newItem: PortableTextText = {
      _type: "block",
      style,
      children: [],
    };
    out.push(newItem);
    return newItem;
  }
}

function joinRegexps(regexps: RegExp[], flags: string) {
  return new RegExp(`(?:${regexps.map((re) => re.source).join("|")})`, flags);
}

const PARSER_REGEXPS = {
  math: /(\$\$(?:[^$]|$[^$])*\$\$)/, // Matches something like "$$x+y$$"
  codeblock: /(```(?:[\s\S]*?)```)/, // Matches something like ```console.log("hi")``` or `console.log("hi")`
  codeinline: /(`.*?`)/, // Matches something like ```console.log("hi")``` or `console.log("hi")`
  answerSpace: /(\{\{(?:[^{}]|(?!\{\{|\}\})\w)*\}\})/, // Matches {{ }}
  other: /(.+?)/, // Matches anything else
};
const MATH_INDEX = 1;
const CODE_BLOCK_INDEX = 2;
const CODE_INLINE_INDEX = 3;
const ANSWER_SPACE_INDEX = 4;
const OTHER_INDEX = 5;

export function stemToPortableText(text: string, style = "normal") {
  // Note must create a new regexp here because where using RegExp.exec() for repeat execution.
  const regexp = joinRegexps(Object.values(PARSER_REGEXPS), "g");

  let match = regexp.exec(text);

  const out: PortableTextItem[] = [];
  while (match) {
    if (match[MATH_INDEX]) {
      const block = lastBlockOrNewBlock(out, style);
      block.children.push({
        _type: "math",
        text: match[MATH_INDEX],
        html: convertToMml({ math: match[1] }),
      });
    } else if (match[CODE_BLOCK_INDEX]) {
      out.push({
        _type: "codeblock",
        text: match[CODE_BLOCK_INDEX],
      });
    } else if (match[CODE_INLINE_INDEX]) {
      const block = lastBlockOrNewBlock(out, style);
      block.children.push({
        _type: "codeinline",
        text: match[CODE_INLINE_INDEX],
      });
    } else if (match[ANSWER_SPACE_INDEX]) {
      const block = lastBlockOrNewBlock(out, style);
      block.children.push({
        _type: "answer_space",
      });
    } else if (match[OTHER_INDEX]) {
      const block = lastBlockOrNewBlock(out, style);
      const lastItem = block.children.at(-1);
      if (lastItem && lastItem._type === "span") {
        lastItem.text += match[OTHER_INDEX];
      } else {
        block.children.push({
          _type: "span",
          text: String(match[OTHER_INDEX]),
        });
      }
    }
    match = regexp.exec(text);
  }
  return out;
}
