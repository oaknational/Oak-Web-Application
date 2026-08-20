import { formatSentences } from "./formatTranscriptSentences";

describe("formatSentences", () => {
  const sentences = [
    "Hello, Mr. 'Perfectly fine',",
    "How's your heart after breaking mine?",
    "Mr. 'Always at the right place at the right time,' baby.",
    "Hello Mr. 'Casually cruel'",
    "Mr. 'Everything revolves around you'.",
    "I've been Ms. 'Misery' since your goodbye. And you're Mr. 'Perfectly fine'.",
  ];
  it("doesn't split sentences on a full stop after Mr or Ms", () => {
    const result = formatSentences(sentences);
    expect(result[0]).toBe(
      "Hello, Mr. 'Perfectly fine', How's your heart after breaking mine?",
    );
  });

  it("splits sentences based on full stops", () => {
    const result = formatSentences(sentences);
    expect(result[3]).toBe("I've been Ms. 'Misery' since your goodbye.");
  });
  it("creates the expected number of sentences", () => {
    const result = formatSentences(sentences);
    expect(result).toHaveLength(5);
  });
});
