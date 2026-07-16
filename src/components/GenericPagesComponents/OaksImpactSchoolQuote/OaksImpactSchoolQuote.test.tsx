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
    expect(imageEl).toHaveAttribute(
      "src",
      "http://localhost/_next/image?url=https%3A%2F%2Fsanity-asset-cdn.thenational.academy%2Fimages%2Fcuvjke51%2Fproduction%2Fb81ee19a35baa3192360a210fda34cc9b21f4fd6-5824x3264.jpg%3Fw%3D640%26fm%3Dwebp%26q%3D80%26fit%3Dclip%26auto%3Dformat&w=3840&q=75",
    );
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
