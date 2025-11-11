import React from "react";
import { ThemeProvider } from "styled-components";

import { CurriculumModalCloseButton } from "./CurriculumModalCloseButton";

import oakTheme from "@/styles/theme";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurriculumModalCloseButton", () => {
  it("renders the button", () => {
    const { getByTestId } = render(
      <ThemeProvider theme={oakTheme}>
        <CurriculumModalCloseButton onClose={() => jest.fn()} />
      </ThemeProvider>,
    );

    expect(getByTestId("close-modal-button")).toBeInTheDocument();
  });
});
