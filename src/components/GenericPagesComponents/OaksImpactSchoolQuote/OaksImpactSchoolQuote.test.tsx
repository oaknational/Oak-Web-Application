import { fixtureData } from "./OaksImpactSchoolQuote.fixtures";

import { OaksImpactSchoolQuote } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("OaksImpactSchoolQuote", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole } = render(
      <OaksImpactSchoolQuote {...fixtureData} />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent("Ormiston Academies Trust");
    const imageEl = getByRole("img");
    expect(imageEl).toHaveAttribute("alt", "TEST_ALT");
  });

  it("renders as='li'", () => {
    const { container } = render(
      <OaksImpactSchoolQuote {...fixtureData} as="li" />,
    );
    expect(container).toMatchSnapshot();
    expect(container.firstElementChild?.tagName).toBe("LI");
  });
});
