import { render } from "@testing-library/react";

import { HeadingTag } from "./Typography";

import { Heading, Text } from ".";

describe("Typography", () => {
  test.each([["h1"], ["h1"], ["h1"], ["h1"], ["h1"], ["h1"], ["h1"], ["h1"]])(
    "Heading should correctly render %s tag",
    async (tag) => {
      const { getByRole } = render(
        <Heading tag={tag as HeadingTag} size={32} />
      );

      expect(getByRole("heading", { level: 1 })).toBeTruthy();
    }
  );
  test("Heading should be correct size", async () => {
    const { getByTestId } = render(
      <Heading data-testid="test" size={56} tag="h1" />
    );

    expect(getByTestId("test")).toHaveStyle("font-size: 56px");
  });
  test("Text should be the correct size", async () => {
    const { getByTestId } = render(<Text data-testid="test" size={12} />);

    expect(getByTestId("test")).toHaveStyle("font-size: 12px");
  });
});
