/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchProvider } from "../../context/SearchContext";

import SearchForm from "./SearchForm";

const setTextSpy = jest.fn();

jest.mock("next/router", () => ({
  __esModule: true,
  ...jest.requireActual("next/router"),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));
jest.mock("../../context/SearchContext", () => ({
  __esModule: true,
  ...jest.requireActual("../../context/SearchContext"),
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
    render(<SearchForm />, { wrapper: SearchProvider });
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("updates the text of the search context", async () => {
    const text = "Macbeth";
    render(<SearchForm />, { wrapper: SearchProvider });
    const user = userEvent.setup();

    const searchField = screen.getByRole("searchbox");
    await user.click(searchField);
    await user.keyboard(text);

    const searchButton = screen.getByRole("button");
    await user.click(searchButton);

    expect(setTextSpy).toHaveBeenCalledWith(text);
  });
});
