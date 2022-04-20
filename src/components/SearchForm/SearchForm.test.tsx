/**
 * @jest-environment jsdom
 */
import React from "react";
import * as routerBits from "next/router";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import SearchForm from "./SearchForm";

const setTextSpy = jest.fn();
// const setKeyStagesSpy =
// eslint-disable-next-line
// @ts-ignore
React.useContext = () => {
  return {
    text: "",
    setText: setTextSpy,
  };
};
/* eslint-disable */
// @ts-ignore
routerBits.useRouter = () => {
  return {
    push: jest.fn(),
  };
};
/* eslint-enable */

describe("The <SearchForm> Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders", () => {
    renderWithProviders(<SearchForm />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("updates the text of the search context", async () => {
    const text = "Macbeth";
    renderWithProviders(<SearchForm />);
    const user = userEvent.setup();

    const searchField = screen.getByRole("searchbox");
    await user.click(searchField);
    await user.keyboard(text);

    const searchButton = screen.getByRole("button");
    await user.click(searchButton);

    expect(setTextSpy).toBeCalledWith(text);
  });
});
