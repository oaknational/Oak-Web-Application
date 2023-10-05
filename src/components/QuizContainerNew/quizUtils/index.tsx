import reactStringReplace from "react-string-replace";

import Underline from "../../Underline";

export const shortAnswerTitleFormatter = (
  title: string | null | undefined,
): string | React.ReactNode => {
  const shortAnswerRegex = /\{\{(?:[^{}]|(?!\{\{|\}\})\w)*\}\}/g;
  if (!title) return "";
  if (shortAnswerRegex.test(title)) {
    return reactStringReplace(title, shortAnswerRegex, (match, i) => (
      <>
        {" "}
        <Underline key={i} /> {match}
      </>
    ));
  } else {
    return title;
  }
};

export const removeMarkdown = (title: string | null | undefined): string => {
  return title ? title.replace(/\*{1,2}(.*?)\*{1,2}/g, "$1") : "";
};

export const constrainHeight = (h?: number) =>
  h ? Math.max(Math.min(200, h), 96) : undefined;

export const calcDims = (w?: number, h?: number) => {
  const constrainedHeight = constrainHeight(h);
  return w && h && constrainedHeight
    ? {
        width: Math.round((w / h) * constrainedHeight),
        height: constrainedHeight,
      }
    : { width: undefined, height: undefined };
};
