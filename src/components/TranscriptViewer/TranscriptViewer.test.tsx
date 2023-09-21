import TranscriptViewer from "./TranscriptViewer";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const transcriptSentences = [
  "- Hello again, it's me",
  "Mrs. Wade! This is our second lesson together, and today we're going to look at our rights.",
  "Let's get started.",
];

describe("TranscriptViewer", () => {
  test("it renders all the sentences", () => {
    const { getByText, getAllByRole } = renderWithTheme(
      <TranscriptViewer transcriptSentences={transcriptSentences} />
    );

    for (const s of transcriptSentences) {
      expect(getByText(s)).toBeInTheDocument();
    }

    expect(getAllByRole("article")).toHaveLength(1);
  });
});
