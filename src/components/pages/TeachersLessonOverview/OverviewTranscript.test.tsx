import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import OverviewTranscript from "./OverviewTranscript";

const transcriptSentences = [
  "- Hello again, it's me",
  "Mrs. Wade! This is our second lesson together, and today we're going to look at our rights.",
  "Let's get started.",
];

describe("OverviewTranscript", () => {
  test("it renders", () => {
    const { getByTestId } = renderWithTheme(
      <OverviewTranscript transcriptSentences={transcriptSentences} />
    );

    expect(getByTestId("transcript")).toBeInTheDocument();
  });
});
