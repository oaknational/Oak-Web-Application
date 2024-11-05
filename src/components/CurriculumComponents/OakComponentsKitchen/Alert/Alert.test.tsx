import Alert from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Fieldset", () => {
  test("all options", async () => {
    const { baseElement } = renderWithTheme(
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
    const { baseElement } = renderWithTheme(
      <Alert message="Default example" />,
    );

    expect(baseElement).toMatchSnapshot();
  });
});
