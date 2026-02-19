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

  it("renders default principles when none are provided", () => {
    const { getAllByRole } = render(
      <GuidingPrinciples
        $background="bg-primary"
        accentColor="bg-decorative4-subdued"
      />,
    );
    const headingEls = getAllByRole("heading", { level: 3 });
    expect(headingEls.length).toEqual(6);
    expect(headingEls[0]).toHaveTextContent("Evidence-informed");
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

  it("renders OakImage when imageUrl is provided from CMS", () => {
    const { baseElement } = render(
      <GuidingPrinciples
        $background="bg-primary"
        accentColor="bg-decorative4-subdued"
        principles={testPrinciples}
        imageUrl="https://cdn.sanity.io/images/test.png"
        imageAlt="CMS image"
      />,
    );
    const img = baseElement.querySelector("img");
    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("cdn.sanity.io"),
    );
    expect(img).toHaveAttribute("alt", "CMS image");
  });
});
