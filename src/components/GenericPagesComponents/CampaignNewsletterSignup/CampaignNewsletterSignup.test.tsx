import React from "react";
import "@testing-library/jest-dom";

import CampaignNewsletterSignup from "./CampaignNewsletterSignup";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import mockCampaign from "@/fixtures/campaign/mockCampaign";

const mockData = mockCampaign.content.find(
  ({ type }) => type === "NewsletterSignUp",
);

describe("CampaignNewsletterSignup", () => {
  it("renders", () => {
    const { getByTestId } = renderWithTheme(
      <CampaignNewsletterSignup data-testid="test" {...mockData} />,
    );
    expect(getByTestId("test")).toBeInTheDocument();
  });
});
