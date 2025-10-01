type RankResult = {
  slug: string;
  score: number;
  matched: string;
};

export function rankMatches(
  query: string,
  candidates: Array<{ slug: string; matched: string }>,
): RankResult | undefined {
  const queryLower = query.toLowerCase().trim();
  const queryWords = queryLower.split(/\s+/);
  const scoredMatches: RankResult[] = [];

  for (const candidate of candidates) {
    const candidateLower = candidate.matched.toLowerCase().trim();
    let score = 0;
    let matchedWords = 0;

    // Check for complete query match first
    if (candidateLower === queryLower) {
      score = 10000; // Highest possible score for complete match
      scoredMatches.push({
        slug: candidate.slug,
        score,
        matched: candidate.matched,
      });
      continue;
    }

    // Check each query word for exact matches
    for (const word of queryWords) {
      if (candidateLower === word) {
        // Single word exact match
        score += 1000;
        matchedWords++;
      } else if (
        candidateLower.startsWith(word + " ") ||
        candidateLower.endsWith(" " + word) ||
        candidateLower.includes(" " + word + " ")
      ) {
        // Word appears as complete word within candidate
        score += 800;
        matchedWords++;
      } else if (candidateLower === word.substring(0, candidateLower.length)) {
        // Candidate is exact prefix of query word
        score += 600;
        matchedWords++;
      }
    }

    // Only include candidates that matched at least one word
    if (matchedWords > 0) {
      // Bonus for matching more words
      score += matchedWords * 200;

      scoredMatches.push({
        slug: candidate.slug,
        score,
        matched: candidate.matched,
      });
    }
  }

  scoredMatches.sort((a, b) => b.score - a.score);
  return scoredMatches[0];
}
