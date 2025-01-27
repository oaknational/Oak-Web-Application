import { screen } from "@testing-library/react";

import SubjectListingCardCountCardWithPathways from "./SubjectListingCardCountCardWithPathways";

import { Subjects } from "@/pages/teachers/key-stages/[keyStageSlug]/subjects";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import subjectListingFixture from "@/node-lib/curriculum-api-2023/fixtures/subjectListing.fixture";

const subjects: [Subjects, ...Subjects[]] = subjectListingFixture().subjects;

const subjectSelected = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      browseRefined: (...args: unknown[]) => subjectSelected(...args),
    },
  }),
}));

describe("SubjectListingCardCountCardWithPathways", () => {
  it("renders the component with correct title and count", () => {
    if (subjects[4]) {
      renderWithTheme(
        <SubjectListingCardCountCardWithPathways
          keyStageSlug={"ks4"}
          keyStageTitle="Key stage 4"
          subjectPathwaysArray={subjects[4]}
        />,
      );
      expect(screen.getByText("GCSE")).toBeInTheDocument();
      expect(screen.getByText("Core")).toBeInTheDocument();
    }
  });

  it("displays the correct aria-label for each subject pathway", () => {
    if (subjects[4]) {
      renderWithTheme(
        <SubjectListingCardCountCardWithPathways
          keyStageSlug={"ks4"}
          keyStageTitle="Key stage 4"
          subjectPathwaysArray={subjects[4]}
        />,
      );

      const citizenshipCoreAriaLabel = screen.getByLabelText(
        "Citizenship Core: 4 units, 6 lessons",
      );
      const citizenshipGCSEAriaLabel = screen.getByLabelText(
        "Citizenship GCSE: 2 units, 3 lessons - new content",
      );

      expect(citizenshipGCSEAriaLabel).toBeInTheDocument();
      expect(citizenshipCoreAriaLabel).toBeInTheDocument();
    }
  });
});
