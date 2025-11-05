import { Fieldset, FieldsetLegend } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("Fieldset", () => {
  test("render", async () => {
    const { baseElement } = render(
      <Fieldset>
        <FieldsetLegend>testing</FieldsetLegend>
      </Fieldset>,
    );

    expect(baseElement).toMatchSnapshot();
  });
});
