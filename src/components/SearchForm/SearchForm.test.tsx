import React, { FC } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";

import { SearchProvider } from "../../context/Search/SearchContext";
import theme from "../../styles/theme";

import SearchForm from "./SearchForm";

const Providers: FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <SearchProvider>{children}</SearchProvider>
    </ThemeProvider>
  );
};

const setTextSpy = jest.fn();

jest.mock("next/router", () => ({
  __esModule: true,
  ...jest.requireActual("next/router"),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));
jest.mock("../../context/Search/SearchContext", () => ({
  __esModule: true,
  ...jest.requireActual("../../context/Search/SearchContext"),
  useSearchQuery: () => ({
    text: "",
    setText: setTextSpy,
    keyStages: new Set(),
    setKeyStages: jest.fn(),
  }),
}));

describe("The <SearchForm> Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("renders", () => {
    render(<SearchForm />, { wrapper: Providers });
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("updates the text of the search context", async () => {
    const text = "Macbeth";
    render(<SearchForm />, { wrapper: Providers });
    const user = userEvent.setup();

    const searchField = screen.getByRole("searchbox");
    await user.click(searchField);
    await user.keyboard(text);

    const searchButton = screen.getByRole("button");
    await user.click(searchButton);

    expect(setTextSpy).toHaveBeenCalledWith(text);
  });
});
