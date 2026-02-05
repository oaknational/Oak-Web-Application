import { GuidingPrinciples } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("GuidingPrinciples", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole, getAllByRole } = render(
      <GuidingPrinciples
        $background="bg-primary"
        accentColor="bg-decorative4-subdued"
      />,
    );
    expect(baseElement).toMatchSnapshot();

    expect(getByRole("heading", { level: 2 })).toHaveTextContent(
      "Our guiding principles",
    );

    const headingEls = getAllByRole("heading", { level: 3 });
    expect(headingEls.length).toEqual(6);
  });
});
