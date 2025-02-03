import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { act, fireEvent } from "@testing-library/react";

import YourDetails from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("YourDetails", () => {
  describe("school", () => {
    it("initial", () => {
      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <YourDetails
            schools={[
              {
                urn: "TEST",
                name: "Test School",
                la: "test",
                postcode: "ZZ00 0ZZ",
              },
            ]}
            data={{
              schoolId: "TEST",
              schoolName: "Test School",
            }}
            errors={{}}
            onChange={() => {}}
          />
        </OakThemeProvider>,
      );

      expect(getByRole("combobox")).toHaveValue("Test School");
    });

    it("choose", () => {
      const onChange = vi.fn();
      const { rerender, getByRole, getAllByTestId } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <YourDetails
            schools={[
              {
                urn: "TEST",
                name: "Test School",
                la: "test",
                postcode: "ZZ00 0ZZ",
              },
            ]}
            data={{
              schoolId: "",
              schoolName: "",
            }}
            errors={{}}
            onChange={onChange}
          />
        </OakThemeProvider>,
      );

      expect(onChange).toHaveBeenCalledTimes(0);

      const inputElement = getByRole("combobox");
      act(() => {
        inputElement.focus();
        fireEvent.change(inputElement, { target: { value: "Test School" } });
      });

      rerender(
        <OakThemeProvider theme={oakDefaultTheme}>
          <YourDetails
            schools={[
              {
                urn: "TEST",
                name: "Test School",
                la: "test",
                postcode: "ZZ00 0ZZ",
              },
            ]}
            data={{
              schoolId: "",
              schoolName: "Test School",
            }}
            errors={{}}
            onChange={onChange}
          />
        </OakThemeProvider>,
      );

      expect(inputElement).toHaveValue("Test School");

      const allOptions = getAllByTestId("listbox-option");
      act(() => {
        fireEvent.click(allOptions[0]!);
      });

      expect(onChange).toHaveBeenCalledWith({
        schoolId: "TEST-Test School",
        schoolName: "Test School, test, ZZ00 0ZZ",
        schoolNotListed: false,
      });
    });

    it("clear", () => {
      const onChange = vi.fn();
      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <YourDetails
            schools={[
              {
                urn: "TEST",
                name: "Test School",
                la: "test",
                postcode: "ZZ00 0ZZ",
              },
            ]}
            data={{
              schoolId: "TEST",
              schoolName: "Test School",
            }}
            errors={{}}
            onChange={onChange}
          />
        </OakThemeProvider>,
      );

      const inputElement = getByRole("combobox");
      expect(onChange).toHaveBeenCalledTimes(0);
      expect(inputElement).toHaveValue("Test School");

      act(() => {
        inputElement.focus();
        fireEvent.change(inputElement, { target: { value: "" } });
        inputElement.blur();
      });

      expect(onChange).toHaveBeenCalledWith({
        schoolId: undefined,
        schoolName: "",
      });
    });
  });

  describe("not-listed", () => {
    it("initial", () => {
      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <YourDetails
            schools={[]}
            data={{
              schoolNotListed: true,
            }}
            errors={{}}
            onChange={() => {}}
          />
        </OakThemeProvider>,
      );

      const inputElement = getByRole("checkbox");
      expect(inputElement).toBeChecked();
    });
    it("change", () => {
      const onChange = vi.fn();
      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <YourDetails
            schools={[]}
            data={{
              schoolNotListed: false,
            }}
            errors={{}}
            onChange={onChange}
          />
        </OakThemeProvider>,
      );

      const inputElement = getByRole("checkbox");
      expect(inputElement).not.toBeChecked();

      act(() => {
        inputElement.click();
      });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({
        schoolNotListed: true,
      });
    });
  });

  describe("email", () => {
    it("initial", () => {
      const { getByTestId } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <YourDetails
            schools={[]}
            data={{
              email: "test@example.com",
            }}
            errors={{}}
            onChange={() => {}}
          />
        </OakThemeProvider>,
      );

      const inputElement = getByTestId("download-email");
      expect(inputElement).toHaveValue("test@example.com");
    });

    it("change", () => {
      const onChange = vi.fn();
      const { getByTestId } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <YourDetails
            schools={[]}
            data={{
              email: "test@example.com",
            }}
            errors={{}}
            onChange={onChange}
          />
        </OakThemeProvider>,
      );

      const inputElement = getByTestId("download-email");
      expect(inputElement).toHaveValue("test@example.com");

      act(() => {
        inputElement.focus();
        fireEvent.change(inputElement, {
          target: { value: "foobar@example.com" },
        });
      });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({
        email: "foobar@example.com",
      });
    });

    it("clear", () => {
      const onChange = vi.fn();
      const { getByTestId } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <YourDetails
            schools={[]}
            data={{
              email: "test@example.com",
            }}
            errors={{}}
            onChange={onChange}
          />
        </OakThemeProvider>,
      );

      const inputElement = getByTestId("download-email");
      expect(inputElement).toHaveValue("test@example.com");

      act(() => {
        inputElement.focus();
        fireEvent.change(inputElement, { target: { value: "" } });
      });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({
        email: "",
      });
    });
  });
});
