import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { act, fireEvent } from "@testing-library/react";

import AcceptTerms from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("AcceptTerms", () => {
  test("checked", async () => {
    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <AcceptTerms value={true} error={undefined} onChange={() => {}} />
      </OakThemeProvider>,
    );

    const inputElement = getByRole("checkbox");
    expect(inputElement).toBeChecked();
  });

  test("unchecked", async () => {
    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <AcceptTerms value={false} error={undefined} onChange={() => {}} />
      </OakThemeProvider>,
    );

    const inputElement = getByRole("checkbox");
    expect(inputElement).not.toBeChecked();
  });

  test("error", async () => {
    const { getByTestId } = renderWithTheme(
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
    const onChange = vi.fn();
    const { getByRole } = renderWithTheme(
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
