import React from "react";

import NoSearchResults from "./NoSearchResults";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("NoSearchResults component", () => {
  it("component renders title", () => {
    const { getByRole } = render(<NoSearchResults searchTerm={"&nsdp"} />);

    const title = getByRole("heading", { name: "No search results" });

    expect(title).toBeInTheDocument();
  });

  it("component renders the search term passed into it", () => {
    const { getByText } = render(<NoSearchResults searchTerm={"&nsdp"} />);

    const searchTerm = getByText(/&nsdp/);

    expect(searchTerm).toBeInTheDocument();
  });
});
