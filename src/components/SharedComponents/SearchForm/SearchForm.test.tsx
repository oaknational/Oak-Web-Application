/**
 * @jest-environment jsdom
 */
import React from "react";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import SearchForm from "./SearchForm";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const handleSubmit = jest.fn();

const render = renderWithProviders();
const searchJourneyInitiated = jest.fn();
const searchAttempted = jest.fn();
jest.mock("@/context/Analytics/useAnalytics.ts", () => ({
  __esModule: true,
  default: () => ({
    track: {
      searchJourneyInitiated: (...args: unknown[]) =>
        searchJourneyInitiated(...args),
      searchAttempted: (...args: unknown[]) => searchAttempted(...args),
    },
  }),
}));

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("<SearchForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders", () => {
    render(
      <SearchForm
        searchContext="homepage"
        placeholderText="Search by keyword or topic"
        searchTerm=""
        handleSubmit={handleSubmit}
        analyticsSearchSource={"homepage search box"}
      />,
    );
    const input = screen.getByPlaceholderText("Search by keyword or topic");
    expect(input).toBeInTheDocument();
  });

  it("typing text and clicking button submit is handled correctly", async () => {
    const searchTerm = "Macbeth";
    const { getByRole } = render(
      <SearchForm
        searchContext="homepage"
        placeholderText=""
        searchTerm=""
        handleSubmit={handleSubmit}
        analyticsSearchSource={"homepage search box"}
      />,
    );
    const user = userEvent.setup();

    const searchField = getByRole("searchbox");
    await user.click(searchField);
    await user.keyboard(searchTerm);

    const searchButton = getByRole("button", { name: "submit" });
    await user.click(searchButton);

    expect(handleSubmit).toHaveBeenCalledWith({ searchTerm });
  });

  it("searchTerm prop acts as the initial value for the search input", async () => {
    const initialText = "Mac";
    const addedText = "be";
    const { getByRole } = render(
      <SearchForm
        searchContext="homepage"
        placeholderText=""
        handleSubmit={handleSubmit}
        searchTerm={initialText}
        analyticsSearchSource={"homepage search box"}
      />,
    );
    const user = userEvent.setup();

    const searchField = getByRole("searchbox");
    await user.click(searchField);
    await user.keyboard(addedText);

    const searchButton = getByRole("button", { name: "submit" });
    await user.click(searchButton);

    expect(handleSubmit).toHaveBeenCalledWith({
      searchTerm: initialText + addedText,
    });
  });

  it("{Enter} submits the form if search input has focus", async () => {
    const { getByRole } = render(
      <SearchForm
        searchContext="homepage"
        placeholderText=""
        searchTerm=""
        handleSubmit={handleSubmit}
        analyticsSearchSource={"homepage search box"}
      />,
    );
    const user = userEvent.setup();
    const searchField = getByRole("searchbox");
    await user.click(searchField);
    await user.keyboard("{Enter}");

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("{Enter} does not submit the form if search if inputs don't have focus", async () => {
    render(
      <SearchForm
        searchContext="homepage"
        placeholderText=""
        searchTerm=""
        handleSubmit={handleSubmit}
        analyticsSearchSource={"homepage search box"}
      />,
    );
    const user = userEvent.setup();
    await user.keyboard("{Enter}");

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("search input is first tabbable element", async () => {
    render(
      <SearchForm
        searchContext="homepage"
        placeholderText=""
        searchTerm=""
        handleSubmit={handleSubmit}
        analyticsSearchSource={"homepage search box"}
      />,
    );
    const user = userEvent.setup();
    await user.keyboard("{Enter}");

    expect(handleSubmit).not.toHaveBeenCalled();
  });
  it("submit button is second tabbable element", async () => {
    render(
      <SearchForm
        searchContext="homepage"
        placeholderText=""
        searchTerm=""
        handleSubmit={handleSubmit}
        analyticsSearchSource={"homepage search box"}
      />,
    );
    const user = userEvent.setup();
    await user.keyboard("{Enter}");

    expect(handleSubmit).not.toHaveBeenCalled();
  });
  it("track.searchJourneyInitiated is called after selecting the input box ", async () => {
    const initialText = "M";

    const { getByRole } = render(
      <SearchForm
        searchContext="homepage"
        placeholderText=""
        handleSubmit={handleSubmit}
        searchTerm={initialText}
        analyticsSearchSource={"homepage search box"}
      />,
    );
    const user = userEvent.setup();

    const searchField = getByRole("searchbox");
    await user.click(searchField);

    expect(searchJourneyInitiated).toHaveBeenCalledTimes(1);
    expect(searchJourneyInitiated).toHaveBeenCalledWith({
      searchSource: "homepage search box",
      context: "homepage",
    });
  });
  it("search input is populated with placeholder text", () => {
    const placeholderText = "Search by keyword or topic";
    render(
      <SearchForm
        searchContext="homepage"
        placeholderText={placeholderText}
        searchTerm=""
        handleSubmit={handleSubmit}
        analyticsSearchSource={"homepage search box"}
      />,
    );

    const searchField = screen.getByPlaceholderText(placeholderText);
    expect(searchField).toBeInTheDocument();
  });
});
