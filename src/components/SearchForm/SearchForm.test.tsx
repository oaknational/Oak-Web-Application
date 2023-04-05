/**
 * @jest-environment jsdom
 */
import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import SearchForm from "./SearchForm";

const setTextSpy = jest.fn();
const setPushSpy = jest.fn();

const providers = { theme: {} };

jest.mock("next/router", () => ({
  __esModule: true,
  ...jest.requireActual("next/router"),
  useRouter: () => ({
    pathname: "/beta/teachers",
    push: setPushSpy,
    query: {},
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

describe("<SearchForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("renders", () => {
    renderWithProviders(<SearchForm />, { providers });
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("updates the text of the search context", async () => {
    const text = "Macbeth";
    renderWithProviders(<SearchForm />, { providers });
    const user = userEvent.setup();

    const searchField = screen.getByRole("searchbox");
    await user.click(searchField);
    await user.keyboard(text);

    const searchButton = screen.getByRole("button");
    await user.click(searchButton);

    expect(setTextSpy).toHaveBeenCalledWith(text);
  });

  it("navigates to search page", async () => {
    const text = "Macbeth";
    renderWithProviders(<SearchForm />, { providers });
    const user = userEvent.setup();

    const searchField = screen.getByRole("searchbox");
    await user.click(searchField);
    await user.keyboard(text);

    const searchButton = screen.getByRole("button");
    await user.click(searchButton);

    expect(setPushSpy).toHaveBeenCalledWith({
      pathname: "/beta/teachers/search",
      query: { term: text },
    });
  });
});
