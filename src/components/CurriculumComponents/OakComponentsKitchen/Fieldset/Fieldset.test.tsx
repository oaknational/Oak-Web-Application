import { Fieldset, FieldsetLegend } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Fieldset", () => {
  test("render", async () => {
    const { baseElement } = renderWithTheme(
      <Fieldset>
        <FieldsetLegend>testing</FieldsetLegend>
      </Fieldset>,
    );

    expect(baseElement).toMatchSnapshot();
  });
});
