import { render } from "@testing-library/react";

import Card from ".";

describe("spacing", () => {
  test("has default padding 24", async () => {
    const { getByTestId } = render(<Card data-testid="test" />);

    expect(getByTestId("test")).toHaveStyle("padding-left: 24px");
    expect(getByTestId("test")).toHaveStyle("padding-top: 24px");
    expect(getByTestId("test")).toHaveStyle("padding-bottom: 24px");
    expect(getByTestId("test")).toHaveStyle("padding-right: 24px");
  });
  test("can pass custom padding", async () => {
    const { getByTestId } = render(<Card data-testid="test" $pl={12} />);

    expect(getByTestId("test")).toHaveStyle("padding-left: 12px");
  });
  test("can pass custom margin", async () => {
    const { getByTestId } = render(<Card data-testid="test" $mb={12} />);

    expect(getByTestId("test")).toHaveStyle("margin-bottom: 12px");
  });
});
