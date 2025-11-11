import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { act, fireEvent } from "@testing-library/react";

import AcceptTerms from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme", "theme"]);

describe("AcceptTerms", () => {
  test("checked", async () => {
    const { getByRole } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <AcceptTerms value={true} error={undefined} onChange={() => {}} />
      </OakThemeProvider>,
    );

    const inputElement = getByRole("checkbox");
    expect(inputElement).toBeChecked();
  });

  test("unchecked", async () => {
    const { getByRole } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <AcceptTerms value={false} error={undefined} onChange={() => {}} />
      </OakThemeProvider>,
    );

    const inputElement = getByRole("checkbox");
    expect(inputElement).not.toBeChecked();
  });

  test("error", async () => {
    const { getByTestId } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <AcceptTerms
          value={true}
          error={"something went wrong"}
          onChange={() => {}}
        />
      </OakThemeProvider>,
    );

    const errorElement = getByTestId("error");
    expect(errorElement).toBeDefined();
    expect(errorElement).toHaveTextContent("something went wrong");
  });

  test("action", async () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <AcceptTerms value={true} onChange={onChange} />
      </OakThemeProvider>,
    );

    expect(onChange).toHaveBeenCalledTimes(0);
    act(() => {
      const element = getByRole("checkbox");
      fireEvent.click(element);
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
