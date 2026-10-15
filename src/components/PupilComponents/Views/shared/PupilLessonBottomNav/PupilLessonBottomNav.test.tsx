import userEvent from "@testing-library/user-event";

import { PupilLessonBottomNav } from "./PupilLessonBottomNav";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonBottomNav", () => {
  it("renders the proceed button and calls onProceed", async () => {
    const onProceed = jest.fn();
    const user = userEvent.setup();

    render(
      <PupilLessonBottomNav
        proceedLabel="Continue lesson"
        onProceed={onProceed}
      />,
    );

    await user.click(
      document.querySelector(
        '[data-testid="proceed-to-next-section"]',
      ) as HTMLElement,
    );

    expect(document.body).toHaveTextContent("Continue lesson");
    expect(onProceed).toHaveBeenCalledTimes(1);
  });

  it("disables the proceed button while loading", () => {
    render(
      <PupilLessonBottomNav
        proceedLabel="Continue lesson"
        onProceed={jest.fn()}
        isLoading
      />,
    );

    expect(
      document.querySelector('[data-testid="proceed-to-next-section"]'),
    ).toBeDisabled();
  });
});
