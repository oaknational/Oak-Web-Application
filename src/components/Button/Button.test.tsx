import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import Button from ".";

describe("Button", () => {
  it("renders a button", () => {
    const { getByRole } = renderWithTheme(
      <Button
        label="Click me"
        variant="minimal"
        icon="ArrowRight"
        $iconPosition="trailing"
        iconBackground="teachersHighlight"
        onClick={() => jest.fn()}
      />
    );

    expect(getByRole("button")).toBeInTheDocument();
  });
});
