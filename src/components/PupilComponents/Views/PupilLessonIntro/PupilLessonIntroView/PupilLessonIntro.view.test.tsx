import userEvent from "@testing-library/user-event";

import { PupilLessonIntroView } from "./PupilLessonIntro.view";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonIntroView", () => {
  it("renders slots and calls the proceed handler", async () => {
    const onProceed = jest.fn();
    const user = userEvent.setup();

    render(
      <PupilLessonIntroView
        phase="primary"
        heading="What will you need?"
        topNavSlot={<div>Top nav</div>}
        readyToLearnSlot={<div>Ready card</div>}
        lessonInfoSlot={<div>Lesson info</div>}
        licenceSlot={<div>Licence text</div>}
        bottomNav={{ proceedLabel: "Start lesson", onProceed }}
      />,
    );

    expect(document.body).toHaveTextContent("What will you need?");
    expect(document.body).toHaveTextContent("Top nav");
    expect(document.body).toHaveTextContent("Ready card");
    expect(document.body).toHaveTextContent("Lesson info");
    expect(document.body).toHaveTextContent("Licence text");

    await user.click(
      document.querySelector(
        '[data-testid="proceed-to-next-section"]',
      ) as HTMLElement,
    );

    expect(onProceed).toHaveBeenCalledTimes(1);
  });
});
