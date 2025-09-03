import React from "react";
import "@testing-library/jest-dom";

import CampaignNewsletterSignup from "./CampaignNewsletterSignup";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CampaignNewsletterSignup", () => {
  it("renders", () => {
    const { getByTestId } = renderWithTheme(
      <CampaignNewsletterSignup data-testid="test" />,
    );
    expect(getByTestId("test")).toBeInTheDocument();
  });
});
