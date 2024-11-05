import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import Terms from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

test("<Terms/>", () => {
  const { baseElement } = renderWithTheme(
    <OakThemeProvider theme={oakDefaultTheme}>
      <Terms />
    </OakThemeProvider>,
  );
  expect(baseElement).toMatchSnapshot();
});
