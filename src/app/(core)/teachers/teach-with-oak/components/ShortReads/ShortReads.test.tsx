import { screen } from "@testing-library/react";

import { ShortReads } from "./ShortReads";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("ShortReads", () => {
  it("eagerly loads only the initially visible preview", () => {
    render(<ShortReads />);

    const previewLoadingModes = screen
      .getAllByTestId("overview-presentation")
      .map((iframe) => iframe.getAttribute("loading"));

    expect(previewLoadingModes).toEqual(["eager", "lazy", "lazy", "lazy"]);
  });
});
