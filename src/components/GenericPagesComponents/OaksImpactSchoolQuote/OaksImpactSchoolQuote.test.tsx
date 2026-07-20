import { fixtureData } from "../OaksImpactSchoolQuotesSection/OaksImpactSchoolQuotesSection.fixtures";

import { OaksImpactSchoolQuote } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

const fixture = fixtureData.cards[0]!;

describe("OaksImpactSchoolQuote", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole } = render(
      <OaksImpactSchoolQuote {...fixture} />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent("Ormiston Academies Trust");
    const imageEl = getByRole("img");
    expect(imageEl).toHaveAttribute("alt", "TEST_ALT");
  });

  it("renders as='li'", () => {
    const { container } = render(
      <OaksImpactSchoolQuote {...fixture} as="li" />,
    );
    expect(container).toMatchSnapshot();
    expect(container.firstElementChild?.tagName).toBe("LI");
  });
});
