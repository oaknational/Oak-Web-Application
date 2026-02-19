import { GuidingPrinciples } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

const testPrinciples = [
  { heading: "Principle 1", text: "Description 1" },
  { heading: "Principle 2", text: "Description 2" },
  { heading: "Principle 3", text: "Description 3" },
];

describe("GuidingPrinciples", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole, getAllByRole } = render(
      <GuidingPrinciples
        $background="bg-primary"
        accentColor="bg-decorative4-subdued"
        principles={testPrinciples}
      />,
    );
    expect(baseElement).toMatchSnapshot();

    expect(getByRole("heading", { level: 2 })).toHaveTextContent(
      "Our guiding principles",
    );

    const headingEls = getAllByRole("heading", { level: 3 });
    expect(headingEls.length).toEqual(3);
  });

  it("returns null when no principles are provided", () => {
    const { container } = render(
      <GuidingPrinciples
        $background="bg-primary"
        accentColor="bg-decorative4-subdued"
      />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("returns null when principles is an empty array", () => {
    const { container } = render(
      <GuidingPrinciples
        $background="bg-primary"
        accentColor="bg-decorative4-subdued"
        principles={[]}
      />,
    );
    expect(container.innerHTML).toBe("");
  });
});
