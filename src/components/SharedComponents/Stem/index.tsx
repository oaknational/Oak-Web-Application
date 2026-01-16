import { TextItem } from "@oaknational/oak-curriculum-schema";
import {
  PortableTextComponents,
  PortableTextTypeComponentProps,
} from "@portabletext/react";
import { Fragment } from "react";
import { OakCodeRenderer, OakSpan } from "@oaknational/oak-components";
import styled from "styled-components";

import { PortableTextWithDefaults } from "../PortableText";

import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";
import { shortAnswerTitleFormatter } from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import {
  logMissingPortableTextComponents,
  PortableTextItem,
} from "@/utils/portableText";

export type StemPortableText = TextItem & { portableText?: PortableTextItem[] };

export type ConvertTextItem<T> = T extends TextItem
  ? StemPortableText
  : T extends Array<infer S>
    ? Array<ConvertTextItem<S>>
    : T extends object
      ? {
          [K in keyof T]: ConvertTextItem<T[K]>;
        }
      : T;

const ENABLE_SSR = true;

const UnderlineSpan = styled.span`
  display: inline-block;
  border-bottom: 2px solid black;
  padding-bottom: 2px;
  min-width: 48px;
  position: relative;
`;

const stemComponents: PortableTextComponents = {
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
            <OakCodeRenderer string={text} $font="code-3" $mt={"spacing-8"} />
          </Fragment>
        );
      } else {
        return (
          <OakCodeRenderer string={text} $font="code-3" $mt={"spacing-8"} />
        );
      }
    },
    codeinline: (
      props: PortableTextTypeComponentProps<{ text: string; type: "code" }>,
    ) => {
      const text = props.value.text;
      return <OakCodeRenderer string={text} $font="code-3" $mt={"spacing-8"} />;
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
    answer_space: () => {
      // Note: We dangerouslySetInnerHTML here because MathJax library has given us raw HTML as output
      // It's also worth noting that this shouldn't be used for untrusted input.
      return (
        <UnderlineSpan
          // This is an empty box with a line under it, to indicate an answer would go here.
          role="presentation"
          title="An empty space to write an answer in"
          data-testid="underline"
        />
      );
    },
  },
  block: {
    normal: (props) => {
      return <OakSpan $font={"body-1"}>{props.children}</OakSpan>;
    },
  },
  marks: {},
};

type StemProps = {
  stem?: TextItem & { portableText?: PortableTextItem[] };
};
export function Stem({ stem }: StemProps) {
  if (ENABLE_SSR) {
    return (
      <PortableTextWithDefaults
        value={stem?.portableText ?? []}
        components={stemComponents}
        onMissingComponent={logMissingPortableTextComponents}
        withoutDefaultComponents
      />
    );
  } else {
    return <MathJaxWrap>{shortAnswerTitleFormatter(stem?.text)}</MathJaxWrap>;
  }
}
