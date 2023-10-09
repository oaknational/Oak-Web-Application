import { getCaptionsFromFile , formatSentences, removeWebVttCharacters } from "./handleTranscript";

describe("removeWebVttCharacters ", () => {
  const sentences = [
    "<v ->Heathcliff</v>",
    "It's me.",
    "cathy",
    "I've come home now",
  ];
  it("removes characters from first sentence", () => {
    const result = removeWebVttCharacters(sentences);
    expect(result[0]).toBe("Heathcliff");
    expect(result[1]).toBe("It's me.");
  });
});

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
      "Hello, Mr. 'Perfectly fine', How's your heart after breaking mine? Mr. 'Always at the right place at the right time,' baby.",
    );
  });
  it("splits sentences based on full stops", () => {
    const result = formatSentences(sentences);
    expect(result[2]).toBe("I've been Ms. 'Misery' since your goodbye.");
  });
  it("creates the expected number of sentences", () => {
    const result = formatSentences(sentences);
    expect(result).toHaveLength(4);
  });
});

jest.mock("@/utils/gCloudStorage", () => ({
  getFileFromBucket: jest.fn(() =>
    Promise.resolve(`WEBVTT

    1
    00:00:06.180 --> 00:00:10.680
    <v ->Hi, welcome to today's lesson on the area of a triangle.</v>
    
    2
    00:00:10.680 --> 00:00:12.750
    By the end of today's lesson, you'll be able
    
    3
    00:00:12.750 --> 00:00:15.753
    to derive the formula for the area of a triangle.
    
    4
    00:00:17.340 --> 00:00:19.050
    Now, in our lesson today,
    
    5
    00:00:19.050 --> 00:00:20.370
    we're going to be using
    
    6
    00:00:20.370 --> 00:00:23.223
    some specific mathematical terminology.
    
    7
    00:00:24.090 --> 00:00:26.452
    For two words that we're going to be using today,
    
    8
    00:00:26.452 --> 00:00:29.310
    in particular, our base
    
    9
    00:00:29.310 --> 00:00:32.310
    and the phrase perpendicular height.`),
  ),
}));

const mockParse = jest
  .fn()
  .mockReturnValueOnce({
    cues: [
      {
        text: "Hi, welcome to today's lesson on the area of a triangle.",
      },
      {
        text: "By the end of today's lesson, you'll be able",
      },
      {
        text: "to derive the formula for the area of a triangle.",
      },
      {
        text: "Now, in our lesson today,",
      },
      {
        text: "we're going to be using",
      },
      {
        text: "some specific mathematical terminology.",
      },
      {
        text: "For two words that we're going to be using today,",
      },
      {
        text: "in particular, our base",
      },
      {
        text: "and the phrase perpendicular height.",
      },
    ],
    errors: [],
    time: 0,
  })
  .mockReturnValueOnce({
    cues: [],
    errors: ["this is the error message"],
    time: 0,
  });

jest.mock("webvtt-parser", () => ({
  WebVTTParser: jest.fn(() => ({
    parse: mockParse,
  })),
}));

describe("getCaptionFromFile", () => {
  it("getCaptionsFromFile returns formnatted sentences from a file name", async () => {
    const result = await getCaptionsFromFile("test.vtt");
    expect(result).toEqual([
      "Hi, welcome to today's lesson on the area of a triangle.",
      "By the end of today's lesson, you'll be able to derive the formula for the area of a triangle.",
      "Now, in our lesson today, we're going to be using some specific mathematical terminology.",
      "For two words that we're going to be using today, in particular, our base and the phrase perpendicular height.",
    ]);
  });
  it("getCaptionsFromFile returns undefined if there is an error", async () => {
    const result = await getCaptionsFromFile("test.vtt");

    expect(result).toBeUndefined();
  });
});
