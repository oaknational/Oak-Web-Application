import FocusIndicator from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("FocusIndicator", () => {
  test("render", async () => {
    const { baseElement } = render(<FocusIndicator />);

    expect(baseElement).toMatchSnapshot();
  });
});
