import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import { PupilLessonQuizBottomNav } from "./PupilLessonQuizBottomNav";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import "@/__tests__/__helpers__/ResizeObserverMock";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonQuizBottomNav", () => {
  it("renders hint, feedback and the action slot", async () => {
    const user = userEvent.setup();

    render(
      <PupilLessonQuizBottomNav
        hint="Try using the key words"
        actionSlot={<button type="button">Try again</button>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Need a hint?" }),
    ).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent("Try using the key words");

    await user.click(screen.getByRole("button", { name: "Need a hint?" }));

    expect(document.body).toHaveTextContent("Try using the key words");
    expect(
      screen.getByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();
  });
});
