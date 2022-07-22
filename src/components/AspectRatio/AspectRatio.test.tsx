import { render } from "@testing-library/react";

import AspectRatio from ".";

describe("components/AspectRatio", () => {
  test("should have the correct padding", async () => {
    const { getByTestId } = render(
      <AspectRatio data-testid="test" ratio={"16:9"} />
    );

    expect(getByTestId("test")).toHaveStyle("padding-top: 56.25%");
  });
});
