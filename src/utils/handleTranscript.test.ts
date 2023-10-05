import { formatSentences, removeWebVttCharacters } from "./handleTranscript";

describe("removeWebVttCharacters ", () => {
  const sentences = [
    "<v ->Heathcliff</v>",
    "It's me",
    "cathy",
    "I've come home now",
  ];
  it("removes characters from first sentence", () => {
    const result = removeWebVttCharacters(sentences);
    expect(result[0]).toBe("Heathcliff");
  });
});

describe("formatSentences", () => {
  const sentences = [
    "Hello, Mr. 'Perfectly fine'",
    "How's your heart after breaking mine?",
    "Mr. 'Always at the right place at the right time,' baby.",
    "Hello Mr. 'Casually cruel'",
    "Mr. 'Everything revolves around you'.",
    "I've been Ms. 'Misery' since your goodbye",
    "And you're Mr. 'Perfectly fine'.",
  ];
  it("doesn't split sentences on a full stop after Mr or Ms", () => {
    const result = formatSentences(sentences);
    expect(result[0]).toBe(
      "Hello, Mr. 'Perfectly fine' How's your heart after breaking mine? Mr. 'Always at the right place at the right time,' baby.",
    );
  });
});
