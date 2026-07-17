import { fixtureData } from "./OaksImpactStats.fixtures";

import { OaksImpactStats } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("OaksImpactStats", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole } = render(
      <OaksImpactStats {...fixtureData} />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { level: 2 })).toHaveTextContent(
      "Oak is now used in 72% of schools",
    );
  });
});
