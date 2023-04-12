import React from "react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import NoSearchResults from "./NoSearchResults";

const render = renderWithProviders();

describe("NoSearchResults component", () => {
  test("component renders title", () => {
    const { getByRole } = render(<NoSearchResults searchTerm={"&nsdp"} />);

    const title = getByRole("heading", { name: "No search results" });

    expect(title).toBeInTheDocument();
  });

  test("component renders the search term passed into it", () => {
    const { getByText } = render(<NoSearchResults searchTerm={"&nsdp"} />);

    const searchTerm = getByText(/&nsdp/);

    expect(searchTerm).toBeInTheDocument();
  });
});
