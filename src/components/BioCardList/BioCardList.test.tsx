import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import BioCardList from "./BioCardList";

describe("BioCardList", () => {
  test("renders corrent headings", () => {
    const { getAllByRole } = renderWithTheme(
      <BioCardList
        people={[
          {
            name: "Crayon Person",
            role: "Underling",
          },
          {
            name: "Leaf Breaker",
            role: "Underling",
          },
        ]}
      />
    );

    const headings = getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(2);
    const [first, second] = headings;
    expect(first).toHaveAccessibleName("Crayon Person");
    expect(second).toHaveAccessibleName("Leaf Breaker");
  });
});
