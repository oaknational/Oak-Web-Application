import { TextItem } from "@oaknational/oak-curriculum-schema";
import { OakCodeRenderer, OakSpan } from "@oaknational/oak-components";
import {
  MissingComponentHandler,
  PortableTextTypeComponentProps,
} from "@portabletext/react";
import { Fragment } from "react";
import styled from "styled-components";

import { PortableTextWithDefaults } from "../PortableText";

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

function ifLastItemIsBlock(out: PortableTextItem[]) {
  const lastItem = out.at(-1);
  if (lastItem && lastItem._type === "block") {
    return lastItem;
  } else {
    const newItem: PortableTextText = {
      _type: "block",
      style: "normal",
      children: [],
    };
    out.push(newItem);
    return newItem;
  }
}

export function stemToPortableText(text: string) {
  const mathRegEx = /(\$\$([^$]|$[^$])*\$\$)/; // Matches something like "$$x+y$$"
  const codeRegEx = /(```(?:[\s\S]*?)```|(?:`.*?`))/; // Matches something like ```console.log("hi")``` or `console.log("hi")`
  const restRegexp = /(.+?)/; // Matches anything else
  const regexp = new RegExp(
    `(?:${mathRegEx.source}|${codeRegEx.source}|${restRegexp.source})`,
    "g",
  );

  let match = regexp.exec(text);
  const out: PortableTextItem[] = [];
  while (match) {
    if (match[1]) {
      const block = ifLastItemIsBlock(out);
      block.children.push({
        _type: "math",
        text: match[1],
        html: convertToMml({ math: match[1] }),
      });
    } else if (match[3]) {
      if (match[3].startsWith("```")) {
        out.push({
          _type: "codeblock",
          text: match[3],
        });
      } else {
        const block = ifLastItemIsBlock(out);
        block.children.push({
          _type: "codeinline",
          text: match[3],
        });
      }
    } else {
      const block = ifLastItemIsBlock(out);
      const lastItem = block.children.at(-1);
      if (lastItem && lastItem._type === "span") {
        lastItem.text += match[4];
      } else {
        block.children.push({
          _type: "span",
          text: String(match[4]),
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
  stem: TextItem;
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
    return <MathJaxWrap>{shortAnswerTitleFormatter(stem.text)}</MathJaxWrap>;
  }
}
