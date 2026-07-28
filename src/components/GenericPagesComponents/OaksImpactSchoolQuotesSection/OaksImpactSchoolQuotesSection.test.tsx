import { fixtureData } from "../OaksImpactSchoolQuotesSection/OaksImpactSchoolQuotesSection.fixtures";

import { OaksImpactSchoolQuotesSection } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("OaksImpactSchoolQuotesSection", () => {
  it("renders correctly", () => {
    const { baseElement } = render(
      <OaksImpactSchoolQuotesSection {...fixtureData} />,
    );
    expect(baseElement).toMatchSnapshot();
  });
});
