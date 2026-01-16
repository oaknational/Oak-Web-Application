import Alert from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("Fieldset", () => {
  test("all options", async () => {
    const { baseElement } = render(
      <>
        <Alert type="info" message="Info example" />
        <Alert type="neutral" message="Neutral example" />
        <Alert type="success" message="Success example" />
        <Alert type="alert" message="Alert example" />
        <Alert type="error" message="Error example" />
      </>,
    );

    expect(baseElement).toMatchSnapshot();
  });

  test("default options", () => {
    const { baseElement } = render(<Alert message="Default example" />);

    expect(baseElement).toMatchSnapshot();
  });
});
