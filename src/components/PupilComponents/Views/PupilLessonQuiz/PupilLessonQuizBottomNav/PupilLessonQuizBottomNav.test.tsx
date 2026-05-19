import { PupilLessonQuizBottomNav } from "./PupilLessonQuizBottomNav";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import "@/__tests__/__helpers__/ResizeObserverMock";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonQuizBottomNav", () => {
  it("renders hint, feedback and the action slot", () => {
    render(
      <PupilLessonQuizBottomNav
        hint="Try using the key words"
        actionSlot={<button type="button">Try again</button>}
      />,
    );

    expect(document.body).toHaveTextContent("Try using the key words");
    expect(document.body).toHaveTextContent("Try again");
  });
});
