import React from "react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import NoSearchResults from "./NoSearchResults";

describe("NoSearchResults component", () => {
  test("component renders title", () => {
    const { getByRole } = renderWithProviders(
      <NoSearchResults searchTerm={"&nsdp"} />
    );

    const title = getByRole("heading", { name: "No search results" });

    expect(title).toBeInTheDocument();
  });

  test("component renders the search term passed into it", () => {
    const { getByText } = renderWithProviders(
      <NoSearchResults searchTerm={"&nsdp"} />
    );

    const searchTerm = getByText(/&nsdp/);

    expect(searchTerm).toBeInTheDocument();
  });
});
