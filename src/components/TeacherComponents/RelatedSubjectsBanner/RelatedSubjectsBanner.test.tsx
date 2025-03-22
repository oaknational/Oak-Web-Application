import { render, screen } from "@testing-library/react";

import RelatedSubjectsBanner from "./RelatedSubjectsBanner";

// Mock the FinancialEducationBanner component
jest.mock("./banners/FinancialEducationBanner", () => {
  return jest.fn(({ isDesktop }) => (
    <>
      <div data-testid="financial-education-banner">
        Financial Education Description
      </div>
      <div data-testid="financial-education-banner-isDesktop">
        {isDesktop ? "true" : "false"}
      </div>
    </>
  ));
});

describe("RelatedSubjectsBanner", () => {
  it('renders FinancialEducationBanner when subjectSlug is "financial-education"', () => {
    render(
      <RelatedSubjectsBanner
        subjectSlug="financial-education"
        keyStageSlug="ks4"
        isDesktop
      />,
    );
    expect(
      screen.getByTestId("financial-education-banner"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("financial-education-banner-isDesktop"),
    ).toHaveTextContent("true");
  });

  it("renders nothing when subjectSlug is not 'financial-education'", () => {
    const { container } = render(
      <RelatedSubjectsBanner
        subjectSlug="testing-not-for-publication"
        keyStageSlug="ks4"
        isDesktop
      />,
    );
    expect(container.firstChild).toBeNull();
  });
  it("passes through isDesktop value", () => {
    render(
      <RelatedSubjectsBanner
        subjectSlug="financial-education"
        keyStageSlug="ks4"
        isDesktop={false}
      />,
    );
    expect(
      screen.getByTestId("financial-education-banner"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("financial-education-banner-isDesktop"),
    ).toHaveTextContent("false");
  });
});
