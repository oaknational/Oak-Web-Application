import { screen, within } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import OL from "./OL";

describe("P", () => {
  test("it renders a list", () => {
    renderWithProviders(
      <OL>
        <li>One</li>
        <li>Two</li>
        <li>Three</li>
      </OL>
    );

    const list = screen.getByRole("list");
    const { getAllByRole } = within(list);
    const items = getAllByRole("listitem");
    expect(items.length).toBe(3);
  });
});
