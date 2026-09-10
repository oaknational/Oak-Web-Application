export const getNarrowTranscriptSentences = (
  transcriptSentences: string[] | string | undefined,
) =>
  Array.isArray(transcriptSentences)
    ? transcriptSentences
    : [transcriptSentences ?? ""];
