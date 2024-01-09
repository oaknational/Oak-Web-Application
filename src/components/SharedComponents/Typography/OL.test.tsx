import { screen, within } from "@testing-library/react";

import OL from "./OL";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("OL", () => {
  test("it renders a list", () => {
    renderWithTheme(
      <OL>
        <li>One</li>
        <li>Two</li>
        <li>Three</li>
      </OL>,
    );

    const list = screen.getByRole("list");
    const { getAllByRole } = within(list);
    const items = getAllByRole("listitem");
    expect(items.length).toBe(3);
  });
});
