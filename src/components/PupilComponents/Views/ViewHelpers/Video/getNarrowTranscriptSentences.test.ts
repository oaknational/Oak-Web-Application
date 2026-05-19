import { getNarrowTranscriptSentences } from "./getNarrowTranscriptSentences";

describe("getNarrowTranscriptSentences", () => {
  const cases: [string[] | string | undefined, string[]][] = [
    [
      ["One", "Two"],
      ["One", "Two"],
    ],
    ["Sentence", ["Sentence"]],
    [undefined, [""]],
  ];

  it.each(cases)("returns %s as %s", (transcriptSentences, expected) => {
    expect(getNarrowTranscriptSentences(transcriptSentences)).toEqual(expected);
  });
});
