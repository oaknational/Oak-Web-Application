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
  it("keeps quotation marks around the correct sentences when given a single string", () => {
    const sentence =
      'Sam explains his answer. "I chose textiles. They are soft and comfortable. They are also flexible and can fold up or roll up small. Not all textiles are waterproof, but some are so I would choose one that is."';
    const result = formatSentences(sentence);
    expect(result).toEqual([
      "Sam explains his answer.",
      '"I chose textiles.',
      "They are soft and comfortable.",
      "They are also flexible and can fold up or roll up small.",
      'Not all textiles are waterproof, but some are so I would choose one that is."',
    ]);
  });

  it("keeps quote-closing punctuation at the end of the sentence", () => {
    const sentence = 'He said, "Stop." Then he left.';
    const result = formatSentences(sentence);

    expect(result).toEqual(['He said, "Stop."', "Then he left."]);
  });

  it("keeps multi-character sentence endings together", () => {
    const sentence = 'What?!" She gasped. Then she laughed!';
    const result = formatSentences(sentence);

    expect(result).toEqual(['What?!"', "She gasped.", "Then she laughed!"]);
  });

  it("does not split inside common abbreviations like e.g., i.e., and etc.", () => {
    const sentence =
      "Bring soft materials, e.g. felt and cotton, i.e. fabrics, etc. Then sort them.";
    const result = formatSentences(sentence);

    expect(result).toEqual([
      "Bring soft materials, e.g. felt and cotton, i.e. fabrics, etc.",
      "Then sort them.",
    ]);
  });

  it("does not split at ellipses used mid-sentence", () => {
    const sentence = "I started to explain... then changed my mind.";
    const result = formatSentences(sentence);

    expect(result).toEqual(["I started to explain... then changed my mind."]);
  });
});
