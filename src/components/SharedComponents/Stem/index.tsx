import { TextItem } from "@oaknational/oak-curriculum-schema";
import {
  MissingComponentHandler,
  PortableTextTypeComponentProps,
} from "@portabletext/react";
import { Fragment } from "react";
import styled from "styled-components";

import { PortableTextWithDefaults } from "../PortableText";

import { OakCodeRenderer, OakSpan } from "@oaknational/oak-components";
import convertToMml from "@/utils/mathjax";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";
import { shortAnswerTitleFormatter } from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";

type PortableTextSpan = { _type: "span"; text: string };
type PortableTextText = {
  _type: "block";
  style: string;
  children: (PortableTextMath | PortableTextSpan | PortableTextCodeInline)[];
};
type PortableTextCodeBlock = { _type: "codeblock"; text: string };
type PortableTextCodeInline = { _type: "codeinline"; text: string };
type PortableTextMath = { _type: "math"; text: string; html: string };
type PortableTextItem =
  | PortableTextText
  | PortableTextCodeBlock
  | PortableTextSpan;

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
  other: /(.+?)/, // Matches anything else
};
const MATH_INDEX = 1;
const CODE_BLOCK_INDEX = 2;
const CODE_INLINE_INDEX = 3;
const OTHER_INDEX = 4;

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

const ENABLE_SSR = true;

const UnderlineSpan = styled.span`
  display: inline-block;
  border-bottom: 2px solid black;
  padding-bottom: 2px;
  min-width: 48px;
  position: relative;
`;

const stemComponents = {
  types: {
    codeblock: (
      props: PortableTextTypeComponentProps<{ text: string; type: "code" }>,
    ) => {
      const text = props.value.text;

      const shortAnswerRegex = /\{\{(?:[^{}]|(?!\{\{|\}\})\w)*\}\}/g;
      if (!text) return "";
      if (shortAnswerRegex.test(text)) {
        return (
          <Fragment>
            {" "}
            <UnderlineSpan
              // This is an empty box with a line under it, to indicate an answer would go here.
              role="presentation"
              title="An empty space to write an answer in"
              data-testid="underline"
            />{" "}
            <OakCodeRenderer
              string={text}
              $font="code-3"
              $mt={"space-between-ssx"}
            />
          </Fragment>
        );
      } else {
        return (
          <OakCodeRenderer
            string={text}
            $font="code-3"
            $mt={"space-between-ssx"}
          />
        );
      }
    },
    codeinline: (
      props: PortableTextTypeComponentProps<{ text: string; type: "code" }>,
    ) => {
      const text = props.value.text;
      return (
        <OakCodeRenderer
          string={text}
          $font="code-3"
          $mt={"space-between-ssx"}
        />
      );
    },
    math: (
      props: PortableTextTypeComponentProps<{
        html: string;
        text: string;
        type: "math";
      }>,
    ) => {
      // Note: We dangerouslySetInnerHTML here because MathJax library has given us raw HTML as output
      // It's also worth noting that this shouldn't be used for untrusted input.
      return <OakSpan dangerouslySetInnerHTML={{ __html: props.value.html }} />;
    },
  },
  marks: {},
};

const logMissingPortableTextComponents: MissingComponentHandler = (
  message,
  options,
) => {
  console.log(message, {
    type: options.type,
    nodeType: options.nodeType,
  });
};

type StemProps = {
  stem?: TextItem & { portableText?: PortableTextItem[] };
};
export function Stem({ stem }: StemProps) {
  // TODO: This should also deal with rendering <OakCodeRenderer/> as I've removed that else where
  // See `shortAnswerTitleFormatter` for the logic behind it all
  if (ENABLE_SSR) {
    return (
      <PortableTextWithDefaults
        value={stem?.portableText ?? []}
        components={stemComponents}
        onMissingComponent={logMissingPortableTextComponents}
      />
    );
  } else {
    return <MathJaxWrap>{shortAnswerTitleFormatter(stem?.text)}</MathJaxWrap>;
  }
}
