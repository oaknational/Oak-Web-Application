import { fireEvent, render, screen } from "@testing-library/react";

import CardAsLink from "./CardAsLink";

describe("spacing", () => {
  test("has default padding 24", async () => {
    const { getByTestId } = render(
      <CardAsLink href={"/"} data-testid="test" ariaLabel={""} />
    );

    expect(getByTestId("test")).toHaveStyle("padding-left: 24px");
    expect(getByTestId("test")).toHaveStyle("padding-top: 24px");
    expect(getByTestId("test")).toHaveStyle("padding-bottom: 24px");
    expect(getByTestId("test")).toHaveStyle("padding-right: 24px");
  });
  test("can pass custom padding", async () => {
    const { getByTestId } = render(
      <CardAsLink href={"/"} data-testid="test" pl={12} ariaLabel={""} />
    );

    expect(getByTestId("test")).toHaveStyle("padding-left: 12px");
  });
  test("can pass custom margin", async () => {
    const { getByTestId } = render(
      <CardAsLink href={"/"} data-testid="test" mb={12} ariaLabel={""} />
    );

    expect(getByTestId("test")).toHaveStyle("margin-bottom: 12px");
  });
  it("is a link if clicked", async () => {
    const { getByText } = render(
      <CardAsLink
        href={"https://www.test.com"}
        data-testid="test"
        mb={12}
        ariaLabel={""}
      >
        <h1>Click Me</h1>
      </CardAsLink>
    );

    const link = getByText("Click Me");

    fireEvent.click(link);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://www.test.com"
    );
  });
});
