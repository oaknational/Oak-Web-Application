export const formatSentences = (
  input: Array<string> | string,
): Array<string> => {
  const joined = Array.isArray(input) ? input.join(" ") : input;
  const sentences: string[] = [];
  let start = 0;

  for (let i = 0, nextIndex = 1; i < joined.length; i = nextIndex) {
    nextIndex = i + 1;
    const char = joined[i];

    if (!isSentencePunctuation(char)) {
      continue;
    }

    if (char === "." && shouldKeepFullStop(i, joined)) {
      continue;
    }

    const end = getBoundaryEnd(i, joined);

    // Ellipses are often pauses within a sentence, e.g. "... then"
    if (isMidSentenceEllipsis(i, end, joined)) {
      nextIndex = end + 1;
      continue;
    }

    if (!hasBoundaryAfter(end, joined)) {
      continue;
    }

    const sentence = joined.slice(start, end + 1).trim();
    if (sentence) {
      sentences.push(sentence);
    }

    start = end + 1;
    nextIndex = end + 1;
  }

  // Add remaining text (if any)
  const remainder = joined.slice(start).trim();
  if (remainder) {
    sentences.push(remainder);
  }

  return sentences;
};

// Rule helper functions

// Common honorifics where the trailing dot is not a sentence boundary.
const titles = new Set(["mr", "mrs", "ms", "mx", "dr", "prof", "rev"]);

const isWhitespace = (char: string | undefined): boolean => {
  return /\s/.test(char ?? "");
};

const isAsciiLetter = (char: string | undefined): boolean => {
  return /[A-Za-z]/.test(char ?? "");
};

const isDigit = (char: string | undefined): boolean => {
  return /\d/.test(char ?? "");
};

const isSentencePunctuation = (
  char: string | undefined,
): char is "." | "?" | "!" => {
  return char === "." || char === "?" || char === "!";
};

const isClosingQuoteOrBracket = (char: string | undefined): boolean => {
  return /["'”’)\]}]/.test(char ?? "");
};

const getNextNonSpaceChar = (index: number, joined: string): string | null => {
  for (let i = index + 1; i < joined.length; i++) {
    const currentChar = joined[i] ?? "";
    if (!isWhitespace(currentChar)) {
      return currentChar;
    }
  }
  return null;
};

const getPreviousWord = (index: number, joined: string): string => {
  let end = index - 1;
  while (end >= 0 && isWhitespace(joined[end])) {
    end -= 1;
  }

  let wordStart = end;
  while (wordStart >= 0 && isAsciiLetter(joined[wordStart])) {
    wordStart -= 1;
  }

  return joined.slice(wordStart + 1, end + 1);
};

const getBoundaryEnd = (index: number, joined: string): number => {
  let end = index;

  // Keep grouped punctuation together (e.g. "?!" or "...").
  while (end + 1 < joined.length && isSentencePunctuation(joined[end + 1])) {
    end += 1;
  }

  // Include any trailing closing quote/bracket with the same sentence.
  while (end + 1 < joined.length && isClosingQuoteOrBracket(joined[end + 1])) {
    end += 1;
  }

  return end;
};

const isMidSentenceEllipsis = (
  startIndex: number,
  endIndex: number,
  joined: string,
): boolean => {
  const punctuationRun = joined.slice(startIndex, endIndex + 1);

  if (!/^\.{3,}$/.test(punctuationRun)) {
    return false;
  }

  const nextNonSpace = getNextNonSpaceChar(endIndex, joined);
  return Boolean(nextNonSpace && /[a-z]/.test(nextNonSpace));
};

const hasBoundaryAfter = (index: number, joined: string): boolean => {
  const nextChar = joined[index + 1];
  // We only split when punctuation is followed by whitespace or end-of-text.
  return !nextChar || isWhitespace(nextChar);
};

const shouldKeepFullStop = (index: number, joined: string): boolean => {
  if (joined[index] !== ".") {
    return false;
  }

  const previous = joined[index - 1] ?? "";
  const next = joined[index + 1] ?? "";

  // Decimal numbers, e.g. 3.14
  if (isDigit(previous) && isDigit(next)) {
    return true;
  }

  const previousWord = getPreviousWord(index, joined);
  if (titles.has(previousWord.toLowerCase())) {
    return true;
  }

  // Initials, e.g. A. Smith or A. B.
  if (/^[A-Za-z]$/.test(previousWord)) {
    const nextNonSpace = getNextNonSpaceChar(index, joined);
    if (nextNonSpace && /[A-Z]/.test(nextNonSpace)) {
      return true;
    }
  }

  // Acronyms/initialisms, e.g. U.S. or U.S.A.
  const acronymTail = joined.slice(Math.max(0, index - 10), index + 1);
  if (/(?:\b[A-Za-z]\.){2,}$/.test(acronymTail)) {
    return true;
  }

  return false;
};
