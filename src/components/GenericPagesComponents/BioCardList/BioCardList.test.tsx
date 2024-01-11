import { OverlayProvider } from "react-aria";

import BioCardList from "./BioCardList";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("BioCardList", () => {
  test("renders corrent headings", () => {
    const { getAllByRole } = renderWithTheme(
      <OverlayProvider>
        <BioCardList
          bios={[
            {
              id: "1",
              name: "Crayon Person",
              role: "Co-director",
            },
            {
              id: "2",
              name: "Leaf Breaker",
              role: "Co-director",
            },
          ]}
        />
      </OverlayProvider>,
    );

    const headings = getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(2);
    const [first, second] = headings;
    expect(first).toHaveAccessibleName("Crayon Person");
    expect(second).toHaveAccessibleName("Leaf Breaker");
  });
  test("cards clickable if withModals passed", () => {
    const { getByRole } = renderWithTheme(
      <OverlayProvider>
        <BioCardList
          bios={[
            {
              id: "1",
              name: "Crayon Person",
              role: "Co-director",
            },
            {
              id: "2",
              name: "Leaf Breaker",
              role: "Co-director",
            },
          ]}
          withModals
        />
      </OverlayProvider>,
    );

    const cardClickTarget = getByRole("button", {
      name: "See bio for Crayon Person",
    });
    expect(cardClickTarget).toBeInTheDocument();
  });
  test("cards not clickable by default", () => {
    const { queryByText } = renderWithTheme(
      <OverlayProvider>
        <BioCardList
          bios={[
            {
              id: "1",
              name: "Crayon Person",
              role: "Co-director",
            },
            {
              id: "2",
              name: "Leaf Breaker",
              role: "Co-director",
            },
          ]}
        />
      </OverlayProvider>,
    );

    const cardClickTarget = queryByText("See bio");
    expect(cardClickTarget).not.toBeInTheDocument();
  });
  test("button has aria expanded false when bio is closed", () => {
    const { getByTitle } = renderWithTheme(
      <OverlayProvider>
        <BioCardList
          bios={[
            {
              id: "1",
              name: "Crayon Person",
              role: "Co-director",
            },
          ]}
          withModals={true}
        />
      </OverlayProvider>,
    );

    const button = getByTitle("See bio for Crayon Person");
    expect(button).toHaveAttribute("aria-expanded", "false");
    // aria-expanded true button on BioModal
  });
});
