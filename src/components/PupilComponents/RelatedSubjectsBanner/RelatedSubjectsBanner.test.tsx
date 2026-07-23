import { render, screen } from "@testing-library/react";

import RelatedSubjectsBanner from "./RelatedSubjectsBanner";

import { unitBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/unitBrowseData.fixture";

jest.mock("./banners/SubjectBanner", () => {
  return jest.fn(({ heading, testId }) => (
    <div data-testid={testId}>{heading}</div>
  ));
});

describe("RelatedSubjectsBanner", () => {
  const programmeFields = unitBrowseDataFixture({}).programmeFields;

  it('renders SubjectBanner with financial education copy when subjectSlug is "financial-education"', () => {
    render(
      <RelatedSubjectsBanner
        subjectSlug="financial-education"
        programmeFields={programmeFields}
      />,
    );
    expect(screen.getByTestId("financial-education-banner")).toHaveTextContent(
      "Check out our new finance lessons!",
    );
  });

  it('renders SubjectBanner with digital literacy copy when subjectSlug is "digital-literacy"', () => {
    render(
      <RelatedSubjectsBanner
        subjectSlug="digital-literacy"
        programmeFields={programmeFields}
      />,
    );
    expect(screen.getByTestId("digital-literacy-banner")).toHaveTextContent(
      "Check out our new digital literacy lessons!",
    );
  });

  it("renders nothing when subjectSlug is not supported", () => {
    const { container } = render(
      <RelatedSubjectsBanner
        subjectSlug="testing-not-for-publication"
        programmeFields={programmeFields}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});
