export const formatSentences = (
  input: Array<string> | string,
): Array<string> => {
  // The sentences retrieved may be split in the middle and put onto multiple lines, this roughly puts them back together
  // with a crude hack to ignore full stops following Mr or Mrs
  // also ignoring full stops before quotation, which has the undesired effect of grouping near quotes
  const joined = Array.isArray(input) ? input.join(" ") : input;
  const titles = ["Mr.", "Mrs.", "Ms.", "Mx.", "Dr.", "Prof.", "Rev."];
  const sentences = [];
  let start = 0;

  for (let i = 0; i < joined.length; i++) {
    const char = joined[i];

    if (char === "." || char === "?" || char === "!") {
      // Check if this period belongs to a protected title
      const snippet = joined.slice(Math.max(0, i - 4), i + 1);
      const isTitle = titles.some((title) => snippet.endsWith(title));

      if (!isTitle) {
        // Include punctuation in the sentence
        const sentence = joined.slice(start, i + 1).trim();
        sentences.push(sentence);
        start = i + 1;
      }
    }
  }

  // Add remaining text (if any)
  const remainder = joined.slice(start).trim();
  if (remainder) {
    sentences.push(remainder);
  }

  return sentences;
};
