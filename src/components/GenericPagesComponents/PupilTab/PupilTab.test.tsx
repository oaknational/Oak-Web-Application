import { screen, within } from "@testing-library/react";

import PupilTab from "./PupilTab";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("PupilTab", () => {
  it("renders correct h1 copy", () => {
    renderWithProviders()(<PupilTab aria-current="page" />);

    const pupilTabContainer = screen.getByTestId("pupil-tab");
    const pupilH1 = within(pupilTabContainer).getByRole("heading", {
      level: 1,
    });

    expect(pupilH1).toHaveTextContent("Pupils");
  });
});
