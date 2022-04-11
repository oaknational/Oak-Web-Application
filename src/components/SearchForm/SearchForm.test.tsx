/**
 * @jest-environment jsdom
 */
import React from "react";
import * as routerBits from "next/router";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SearchForm from "./SearchForm";

const setTextSpy = jest.fn();
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
    render(<SearchForm />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("updates the text of the search context", async () => {
    const searchTerm = "Macbeth";
    render(<SearchForm />);
    const user = userEvent.setup();

    const searchField = screen.getByRole("searchbox");
    await user.click(searchField);
    await user.keyboard(searchTerm);

    const searchButton = screen.getByRole("button");
    await user.click(searchButton);

    expect(setTextSpy).toBeCalledWith(searchTerm);
  });
});
