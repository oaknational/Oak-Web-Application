import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import Button from ".";

describe("Button", () => {
  it("renders a button", () => {
    const spy = jest.fn();

    const { getByRole } = renderWithTheme(
      <Button
        label="Click me"
        variant="minimal"
        icon="ArrowRight"
        $iconPosition="trailing"
        iconBackground="teachersHighlight"
        onClick={spy}
      />
    );

    const button = getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("calls onClick function when button is clicked", () => {
    const spy = jest.fn();

    const { getByRole } = renderWithTheme(
      <Button
        label="Click me"
        variant="minimal"
        icon="ArrowRight"
        $iconPosition="trailing"
        iconBackground="teachersHighlight"
        onClick={spy}
      />
    );

    const button = getByRole("button");
    button.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("does nothing onClick if button is disabled", () => {
    const spy = jest.fn();

    const { getByRole } = renderWithTheme(
      <Button
        label="Click me"
        variant="minimal"
        icon="ArrowRight"
        $iconPosition="trailing"
        iconBackground="teachersHighlight"
        disabled={true}
        onClick={spy}
      />
    );

    const button = getByRole("button");
    button.click();

    expect(spy).toHaveBeenCalledTimes(0);
  });
});
