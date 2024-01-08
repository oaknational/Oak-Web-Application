import { render } from "@testing-library/react";

import AspectRatio from ".";

describe("components/AspectRatio", () => {
  test("should have the correct padding for ratio 16:9", async () => {
    const { getByTestId } = render(
      <AspectRatio data-testid="test" ratio={"16:9"} />,
    );
    expect(getByTestId("test")).toHaveStyle("padding-top: 56.25%");
  });
  test("should have the correct padding for ratio 1:1", async () => {
    const { getByTestId } = render(
      <AspectRatio data-testid="test" ratio={"1:1"} />,
    );
    expect(getByTestId("test")).toHaveStyle("padding-top: 100%");
  });
  test("should have the correct padding for ratio 3:2", async () => {
    const { getByTestId } = render(
      <AspectRatio data-testid="test" ratio={"3:2"} />,
    );
    expect(getByTestId("test")).toHaveStyle("padding-top: 66.66%");
  });
  test("should have the correct padding for ratio 2:3", async () => {
    const { getByTestId } = render(
      <AspectRatio data-testid="test" ratio={"2:3"} />,
    );
    expect(getByTestId("test")).toHaveStyle("padding-top: 150%");
  });
  test("should have the correct padding for ratio 7:8", async () => {
    const { getByTestId } = render(
      <AspectRatio data-testid="test" ratio={"7:8"} />,
    );
    expect(getByTestId("test")).toHaveStyle("padding-top: 114%");
  });
});
