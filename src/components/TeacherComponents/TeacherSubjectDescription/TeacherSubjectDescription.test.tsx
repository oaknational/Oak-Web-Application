import { render, screen } from "@testing-library/react";

import TeacherSubjectDescription from "./TeacherSubjectDescription";

import unitListingFixture from "@/node-lib/curriculum-api-2023/fixtures/unitListing.fixture";

// Mock the FinancialEducationDescription component
jest.mock("./descriptions/FinancialEducationDescription", () => {
  return jest.fn(() => (
    <div data-testid="financial-education-description">
      Financial Education Description
    </div>
  ));
});

describe("TeacherSubjectDescription", () => {
  const baseUnitListingData = unitListingFixture({
    subjectSlug: "financial-education",
    keyStageSlug: "ks4",
    keyStageTitle: "Key Stage 4",
  });

  it('renders FinancialEducationDescription when subjectSlug is "financial-education"', () => {
    render(<TeacherSubjectDescription unitListingData={baseUnitListingData} />);
    expect(
      screen.getByTestId("financial-education-description"),
    ).toBeInTheDocument();
  });

  it("renders nothing when subjectSlug is not 'financial-education'", () => {
    const unitListingData = unitListingFixture({
      ...baseUnitListingData,
      subjectSlug: "testing-not-for-publication",
    });
    const { container } = render(
      <TeacherSubjectDescription unitListingData={unitListingData} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
