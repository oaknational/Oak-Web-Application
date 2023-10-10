import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import Button from "./HomePageTabImageButton";

describe("Button", () => {
  it("renders a button", () => {
    const spy = jest.fn();

    const { getByRole } = renderWithTheme(
      <Button
        label="Click me"
        onClick={spy}
        title={""}
        imageSlug={"magic-carpet"}
      />,
    );

    const button = getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("calls onClick function when button is clicked", () => {
    const spy = jest.fn();

    const { getByRole } = renderWithTheme(
      <Button
        label="Click me"
        onClick={spy}
        title={""}
        imageSlug={"magic-carpet"}
      />,
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
        disabled={true}
        onClick={spy}
        title={""}
        imageSlug={"magic-carpet"}
      />,
    );

    const button = getByRole("button");
    button.click();

    expect(spy).toHaveBeenCalledTimes(0);
  });
});
