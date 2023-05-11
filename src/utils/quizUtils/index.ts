export const shortAnswerTitleFormatter = (
  title: string | null | undefined
): string => {
  const shortAnswerRegex = /\{\{\}\}/g;
  const replacement = "___";
  if (!title) return "";
  if (shortAnswerRegex.test(title)) {
    const newTitle = title.replace(shortAnswerRegex, replacement);
    return newTitle;
  } else {
    return title;
  }
};
