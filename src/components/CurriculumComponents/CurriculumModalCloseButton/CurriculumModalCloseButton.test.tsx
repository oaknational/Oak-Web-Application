import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import { CurriculumModalCloseButton } from "./CurriculumModalCloseButton";

import oakTheme from "@/styles/theme";

describe("CurriculumModalCloseButton", () => {
  it("renders the button", () => {
    const { getByTestId } = render(
      <ThemeProvider theme={oakTheme}>
        <CurriculumModalCloseButton onClose={() => vi.fn()} />
      </ThemeProvider>,
    );

    expect(getByTestId("close-modal-button")).toBeInTheDocument();
  });
});
