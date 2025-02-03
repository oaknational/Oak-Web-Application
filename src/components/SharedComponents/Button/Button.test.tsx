import Button from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Button", () => {
  it("renders a button", () => {
    const spy = vi.fn();

    const { getByRole } = renderWithTheme(
      <Button
        label="Click me"
        variant="minimal"
        icon="arrow-right"
        $iconPosition="trailing"
        iconBackground="blue"
        onClick={spy}
      />,
    );

    const button = getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("calls onClick function when button is clicked", () => {
    const spy = vi.fn();

    const { getByRole } = renderWithTheme(
      <Button
        label="Click me"
        variant="minimal"
        icon="arrow-right"
        $iconPosition="trailing"
        iconBackground="blue"
        onClick={spy}
      />,
    );

    const button = getByRole("button");
    button.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("does nothing onClick if button is disabled", () => {
    const spy = vi.fn();

    const { getByRole } = renderWithTheme(
      <Button
        label="Click me"
        variant="minimal"
        icon="arrow-right"
        $iconPosition="trailing"
        iconBackground="blue"
        disabled={true}
        onClick={spy}
      />,
    );

    const button = getByRole("button");
    button.click();

    expect(spy).toHaveBeenCalledTimes(0);
  });
});
