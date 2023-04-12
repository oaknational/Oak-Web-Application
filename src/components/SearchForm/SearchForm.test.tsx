/**
 * @jest-environment jsdom
 */
import React from "react";
import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import SearchForm from "./SearchForm";

const handleSubmit = jest.fn();

const providers = { theme: {} };
const render = renderWithProviders(providers);

describe("<SearchForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders", () => {
    const { getByRole } = render(
      <SearchForm searchTerm="" handleSubmit={handleSubmit} />
    );
    const button = getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("typing text and clicking button submit is handled correctly", async () => {
    const searchTerm = "Macbeth";
    const { getByRole } = render(
      <SearchForm searchTerm="" handleSubmit={handleSubmit} />
    );
    const user = userEvent.setup();

    const searchField = getByRole("searchbox");
    await user.click(searchField);
    await user.keyboard(searchTerm);

    const searchButton = getByRole("button");
    await user.click(searchButton);

    expect(handleSubmit).toHaveBeenCalledWith({ searchTerm });
  });

  it("searchTerm prop acts as the initial value for the search input", async () => {
    const initialText = "Mac";
    const addedText = "be";
    const { getByRole } = render(
      <SearchForm searchTerm={initialText} handleSubmit={handleSubmit} />
    );
    const user = userEvent.setup();

    const searchField = getByRole("searchbox");
    await user.click(searchField);
    await user.keyboard(addedText);

    const searchButton = getByRole("button");
    await user.click(searchButton);

    expect(handleSubmit).toHaveBeenCalledWith({
      searchTerm: initialText + addedText,
    });
  });

  it("{Enter} submits the form if search input has focus", async () => {
    const { getByRole } = render(
      <SearchForm searchTerm={""} handleSubmit={handleSubmit} />
    );
    const user = userEvent.setup();
    const searchField = getByRole("searchbox");
    await user.click(searchField);
    await user.keyboard("{Enter}");

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("{Enter} does not submit the form if search if inputs don't have focus", async () => {
    render(<SearchForm searchTerm={""} handleSubmit={handleSubmit} />);
    const user = userEvent.setup();
    await user.keyboard("{Enter}");

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("search input is first tabbable element", async () => {
    render(<SearchForm searchTerm={""} handleSubmit={handleSubmit} />);
    const user = userEvent.setup();
    await user.keyboard("{Enter}");

    expect(handleSubmit).not.toHaveBeenCalled();
  });
  it("submit button is second tabbable element", async () => {
    render(<SearchForm searchTerm={""} handleSubmit={handleSubmit} />);
    const user = userEvent.setup();
    await user.keyboard("{Enter}");

    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
