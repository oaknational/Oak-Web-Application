import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import Terms from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

test("<Terms/>", () => {
  const { baseElement } = render(
    <OakThemeProvider theme={oakDefaultTheme}>
      <Terms />
    </OakThemeProvider>,
  );
  expect(baseElement).toMatchSnapshot();
});
