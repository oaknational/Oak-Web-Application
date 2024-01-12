import Button from "./HomePageTabImageButton";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("HomePageTabImageButton", () => {
  it("renders a button", () => {
    const spy = vi.fn();

    const { getByRole } = renderWithTheme(
      <Button
        label="Click me"
        onClick={spy}
        title={""}
        activeImageSlug={"magic-carpet"}
        passiveImageSlug="magic-carpet"
      />,
    );

    const button = getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("renders active image when isCurrent is true", () => {
    const { getByTestId } = renderWithTheme(
      <Button
        label="Click me"
        title={""}
        activeImageSlug={"magic-carpet"}
        passiveImageSlug={"atoms"}
        isCurrent={true}
      />,
    );

    expect(getByTestId("magic-carpet")).toBeInTheDocument();
  });

  it("renders passive image when isCurrent is false", () => {
    const { getByTestId } = renderWithTheme(
      <Button
        label="Click me"
        title={""}
        activeImageSlug={"magic-carpet"}
        passiveImageSlug={"atoms"}
        isCurrent={false}
      />,
    );

    expect(getByTestId("atoms")).toBeInTheDocument();
  });

  it("calls onClick function when button is clicked", () => {
    const spy = vi.fn();

    const { getByRole } = renderWithTheme(
      <Button
        label="Click me"
        onClick={spy}
        title={""}
        activeImageSlug={"magic-carpet"}
        passiveImageSlug="magic-carpet"
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
        disabled={true}
        onClick={spy}
        title={""}
        activeImageSlug={"magic-carpet"}
        passiveImageSlug="magic-carpet"
      />,
    );

    const button = getByRole("button");
    button.click();

    expect(spy).toHaveBeenCalledTimes(0);
  });
});
