import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import ButtonAsLink from ".";

describe("ButtonAsLink", () => {
  it("renders a button as a link", () => {
    const { getByRole } = renderWithTheme(
      <ButtonAsLink
        label="Click me"
        variant="minimal"
        icon="arrow-right"
        $iconPosition="trailing"
        iconBackground="teachersHighlight"
      />
    );

    const button = getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("renders the label", () => {
    const { getByText } = renderWithTheme(
      <ButtonAsLink label="Click me" variant="minimal" />
    );

    const button = getByText("Click me");
    expect(button).toBeInTheDocument();
  });

  it("uses the label as the default link title", () => {
    const { getByRole } = renderWithTheme(
      <ButtonAsLink label="Click me" variant="minimal" />
    );

    const button = getByRole("button");
    expect(button).toHaveAttribute("title", "Click me");
  });

  it("uses the aria-label as the link title when provided", () => {
    const { getByRole } = renderWithTheme(
      <ButtonAsLink
        label="Click me"
        variant="minimal"
        aria-label="Click me to do something"
      />
    );

    const button = getByRole("button");
    expect(button).toHaveAttribute("title", "Click me to do something");
  });

  it("appends the labelSuffixA11y to the label and uses it as a title", () => {
    const { getByRole } = renderWithTheme(
      <ButtonAsLink
        label="Click me"
        labelSuffixA11y="to do something"
        variant="minimal"
      />
    );
    const button = getByRole("button");
    expect(button).toHaveAttribute("title", "Click me to do something");
  });
});
