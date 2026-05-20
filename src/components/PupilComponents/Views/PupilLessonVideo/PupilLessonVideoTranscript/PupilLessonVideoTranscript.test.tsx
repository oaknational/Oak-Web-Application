import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import { PupilLessonVideoTranscript } from "./PupilLessonVideoTranscript";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import "@/__tests__/__helpers__/ResizeObserverMock";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonVideoTranscript", () => {
  it("renders transcript content and sign-language control", async () => {
    const onSignLanguageToggle = jest.fn();
    const user = userEvent.setup();

    render(
      <PupilLessonVideoTranscript
        transcriptSentences={["First sentence", "Second sentence"]}
        showSignLanguageToggle={true}
        onSignLanguageToggle={onSignLanguageToggle}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Show sign language" }),
    );

    expect(document.body).toHaveTextContent("First sentence");
    expect(document.body).toHaveTextContent("Second sentence");
    expect(onSignLanguageToggle).toHaveBeenCalledTimes(1);
  });

  it("does not render without transcript sentences", () => {
    const { container } = render(
      <PupilLessonVideoTranscript transcriptSentences={[]} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
