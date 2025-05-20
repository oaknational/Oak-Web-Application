import { render, screen } from "@testing-library/react";

import PupilSubjectDescription from "./PupilSubjectDescription";

import { unitBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/unitBrowseData.fixture";

describe("PupilSubjectDescription", () => {
  it("renders the financial education description when subjectSlug is 'financial-education'", () => {
    const programmeFields = unitBrowseDataFixture({}).programmeFields;
    programmeFields.subjectSlug = "financial-education";

    render(<PupilSubjectDescription programmeFields={programmeFields} />);

    const descriptionElement = screen.getByTestId(
      "pupil-financial-education-description",
    );
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveTextContent(
      /These lessons will help you learn useful finance skills/i,
    );
  });

  it("renders nothing when subjectSlug does not match", () => {
    const programmeFields = unitBrowseDataFixture({}).programmeFields;
    programmeFields.subjectSlug = "testing-not-for-publication";

    const { container } = render(
      <PupilSubjectDescription programmeFields={programmeFields} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
