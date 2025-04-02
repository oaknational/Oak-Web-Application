import { render, screen } from "@testing-library/react";

import RelatedSubjectsBanner from "./RelatedSubjectsBanner";

import { unitBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/unitBrowseData.fixture";

// Mock the FinancialEducationBanner component
jest.mock("./banners/FinancialEducationBanner", () => {
  return jest.fn(() => (
    <div data-testid="financial-education-banner">
      Financial Education Description
    </div>
  ));
});

describe("RelatedSubjectsBanner", () => {
  const programmeFields = unitBrowseDataFixture({}).programmeFields;

  it('renders FinancialEducationBanner when subjectSlug is "financial-education"', () => {
    render(
      <RelatedSubjectsBanner
        subjectSlug="financial-education"
        programmeFields={programmeFields}
      />,
    );
    expect(
      screen.getByTestId("financial-education-banner"),
    ).toBeInTheDocument();
  });

  it("renders nothing when subjectSlug is not 'financial-education'", () => {
    const { container } = render(
      <RelatedSubjectsBanner
        subjectSlug="testing-not-for-publication"
        programmeFields={programmeFields}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});
