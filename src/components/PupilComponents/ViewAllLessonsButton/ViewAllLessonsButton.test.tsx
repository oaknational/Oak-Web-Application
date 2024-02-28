import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { render } from "@testing-library/react";

import { ViewAllLessonsButton } from "./ViewAllLessonsButton";

describe(ViewAllLessonsButton, () => {
  describe("when href is provided", () => {
    it("renders a link", () => {
      const { getByRole } = render(
        <OakThemeProvider theme={oakDefaultTheme}>
          <ViewAllLessonsButton href="/back" />,
        </OakThemeProvider>,
      );

      expect(getByRole("link")).toHaveAttribute("href", "/back");
    });
  });

  describe("when href is not provided", () => {
    it("renders a disabled button", () => {
      const { getByRole } = render(
        <OakThemeProvider theme={oakDefaultTheme}>
          <ViewAllLessonsButton />
        </OakThemeProvider>,
      );

      expect(getByRole("button")).toHaveAttribute("disabled");
    });
  });
});
