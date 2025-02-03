import HomePageTabImageButton from "./HomePageTabImageButton";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("HomePageTabImageButton", () => {
  it("renders a button with role as link", () => {
    const spy = vi.fn();

    const { getByRole } = renderWithTheme(
      <HomePageTabImageButton
        label="Click me"
        onClick={spy}
        title={""}
        activeImageSlug={"magic-carpet"}
        passiveImageSlug="magic-carpet"
      />,
    );

    const button = getByRole("link");
    expect(button).toBeInTheDocument();
  });

  it("renders active image when isCurrent is true", () => {
    const { getByTestId } = renderWithTheme(
      <HomePageTabImageButton
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
      <HomePageTabImageButton
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
      <HomePageTabImageButton
        label="Click me"
        onClick={spy}
        title={""}
        activeImageSlug={"magic-carpet"}
        passiveImageSlug="magic-carpet"
      />,
    );

    const button = getByRole("link");
    button.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("does nothing onClick if button is disabled", () => {
    const spy = vi.fn();

    const { getByRole } = renderWithTheme(
      <HomePageTabImageButton
        label="Click me"
        disabled={true}
        onClick={spy}
        title={""}
        activeImageSlug={"magic-carpet"}
        passiveImageSlug="magic-carpet"
      />,
    );

    const button = getByRole("link");
    button.click();

    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("shows the new icon when showNewIcon prop set to true", async () => {
    const { queryByTestId } = renderWithTheme(
      <HomePageTabImageButton
        label="Click me"
        title={""}
        activeImageSlug={"magic-carpet"}
        passiveImageSlug="magic-carpet"
        showNewIcon={true}
      />,
    );
    const newIcon = queryByTestId("new-icon");
    expect(newIcon).toBeInTheDocument();
    // Would check visibility, but the new icon is not visible on smaller viewports.
  });

  test("adds '(New)' to aria-label when showNewIcon prop set to true", async () => {
    const { getByRole } = renderWithTheme(
      <HomePageTabImageButton
        label="Click me"
        title={""}
        activeImageSlug={"magic-carpet"}
        passiveImageSlug="magic-carpet"
        showNewIcon={true}
      />,
    );
    const button = getByRole("link");
    expect(button).toHaveAttribute("aria-label", "Click me (New)");
  });

  test("Doesn't show a new icon when showNewIcon prop omitted", () => {
    const { queryAllByTestId } = renderWithTheme(
      <HomePageTabImageButton
        label="Click me"
        title={""}
        activeImageSlug={"magic-carpet"}
        passiveImageSlug="magic-carpet"
      />,
    );
    expect(queryAllByTestId("new-icon")).toHaveLength(0);
  });
});
