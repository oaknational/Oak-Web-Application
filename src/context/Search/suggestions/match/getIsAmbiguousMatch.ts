// A crude approximation to determine whether the search term contains more than two words that weren't matched
// If it does, we consider the match to be ambiguous
export const getIsAmbiguousMatch = (
  query: string,
  matches: {
    subject?: string | null;
    keyStage?: string | null;
    examBoard?: string | null;
    year?: string | null;
  },
) => {
  const { subject, keyStage, examBoard, year } = matches;

  const queryWordLength = query.split(" ").length;
  const matchesWordLength = [subject, keyStage, examBoard, year]
    .filter((pf) => !!pf)
    .join(" ")
    .split(" ").length;

  const isAmbiguousMatch = queryWordLength - matchesWordLength > 2;
  return isAmbiguousMatch;
};
