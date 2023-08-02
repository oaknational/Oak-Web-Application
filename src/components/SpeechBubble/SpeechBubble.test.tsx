import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import SpeechBubble from ".";

describe("SpeechBubble", () => {
  it("component will not render when there is no text ", () => {
    const { queryByTestId } = renderWithTheme(
      <SpeechBubble data-testid={"speech-bubble"} label="Teacher tip" />
    );

    expect(queryByTestId("speech-bubble")).not.toBeInTheDocument();
  });
  it("component will not render when the char limit is surpassed ", () => {
    const { queryByTestId } = renderWithTheme(
      <SpeechBubble
        data-testid={"speech-bubble"}
        label="Teacher tip"
        text={
          "This is greater that 250 char - Encourage students to ask 'why' questions, fostering curiosity and critical thinking. Emphasize that no question is silly and every inquiry is an opportunity to learn and promote active learning by incorporating group discussions, hands-on activities."
        }
      />
    );

    expect(queryByTestId("speech-bubble")).not.toBeInTheDocument();
  });
  it("component will render a label", () => {
    const { getByText } = renderWithTheme(
      <SpeechBubble
        data-testid={"speech-bubble"}
        label="Teacher tip"
        text={"Encourage students to ask 'why' questions, fostering curiosity"}
      />
    );

    expect(getByText("Teacher tip")).toBeInTheDocument();
  });
  it("component will render the text if 250 char or below", () => {
    const { getByText } = renderWithTheme(
      <SpeechBubble
        data-testid={"speech-bubble"}
        label="Teacher tip"
        text={"Encourage students to ask 'why' questions, fostering curiosity"}
      />
    );

    expect(
      getByText(
        "Encourage students to ask 'why' questions, fostering curiosity"
      )
    ).toBeInTheDocument();
  });
});
