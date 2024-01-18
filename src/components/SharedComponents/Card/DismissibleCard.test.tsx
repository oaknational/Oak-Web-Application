import userEvent from "@testing-library/user-event";

import DismissibleCard from "./DismissibleCard";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import waitForNextTick from "@/__tests__/__helpers__/waitForNextTick";

describe("DismissibleCard", () => {
  it("'close' button should have correct label", () => {
    const { getByRole } = renderWithTheme(
      <DismissibleCard title="test card" />,
    );
    const button = getByRole("button");
    expect(button).toHaveAccessibleName("Dismiss test card");
  });
  it("pressing 'close' button should remove card from document", async () => {
    const { getByRole, getByTestId } = renderWithTheme(
      <DismissibleCard title="test card" />,
    );
    const button = getByRole("button");
    const user = userEvent.setup();
    await user.click(button);

    await waitForNextTick();

    const card = getByTestId("dismissible-card");
    expect(card).toBeEmptyDOMElement();
  });
});
