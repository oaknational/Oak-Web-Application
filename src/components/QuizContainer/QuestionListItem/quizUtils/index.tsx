import reactStringReplace from "react-string-replace";

import Underline from "../../../Underline";

export const shortAnswerTitleFormatter = (
  title: string | null | undefined
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
