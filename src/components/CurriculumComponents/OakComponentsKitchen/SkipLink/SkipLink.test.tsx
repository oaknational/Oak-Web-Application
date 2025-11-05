import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { act } from "@testing-library/react";

import SkipLink from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("SkipLink", () => {
  test("functions as expected", async () => {
    const { baseElement, getByTestId } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SkipLink href="foo">test</SkipLink>
      </OakThemeProvider>,
    );

    const element = getByTestId("skip-link");
    expect(element.style.position).toEqual("absolute");
    expect(element.style.left).toEqual("-10000px");

    act(() => {
      element.focus();
    });

    expect(element.style.position).toEqual("");
    expect(element.style.left).toEqual("");
    expect(baseElement).toMatchSnapshot();
  });
});
