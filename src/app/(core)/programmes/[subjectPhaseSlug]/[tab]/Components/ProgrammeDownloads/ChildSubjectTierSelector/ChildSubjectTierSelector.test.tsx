import React from "react";
import "@testing-library/jest-dom";

import { ChildSubjectTierSelector } from "./ChildSubjectTierSelector";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const tiers = [
  { tier: "Foundation", tierSlug: "foundation" },
  { tier: "Higher", tierSlug: "higher" },
];

const childSubjects = [
  { subject: "Biology", subjectSlug: "biology" },
  { subject: "Physics", subjectSlug: "physics" },
  { subject: "Chemistry", subjectSlug: "chemistry" },
];

const getTierSubjectValues = jest.fn(() => {});
describe("ChildSubjectTierSelector", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("KS4 Science", () => {
    it("renders KS4 Science: both tiers and child subjects are present", () => {
      const { getByTestId } = renderWithTheme(
        <ChildSubjectTierSelector
          tiers={tiers}
          childSubjects={childSubjects}
          getTierSubjectValues={getTierSubjectValues}
          data-testid="test"
        />,
      );
      expect(getByTestId("tier-selector")).toBeInTheDocument();
      expect(getByTestId("child-subject-selector")).toBeInTheDocument();
    });

    it("renders KS4 Science: biology is pre-selected", () => {
      const { getAllByRole } = renderWithTheme(
        <ChildSubjectTierSelector
          tiers={tiers}
          childSubjects={childSubjects}
          getTierSubjectValues={getTierSubjectValues}
          data-testid="test"
        />,
      );

      const biologyRadioButton = getAllByRole("radio")[0];
      expect(biologyRadioButton).toBeChecked();
      expect(biologyRadioButton).toHaveAttribute("id", "biology");
    });
  });

  describe("KS4 Maths", () => {
    it("renders KS4 Maths: only tiers are present", () => {
      const { getByTestId } = renderWithTheme(
        <ChildSubjectTierSelector
          tiers={tiers}
          getTierSubjectValues={getTierSubjectValues}
          data-testid="test"
        />,
      );
      expect(getByTestId("tier-selector")).toBeInTheDocument();
    });

    it("renders KS4 Maths: foundation is pre-selected", () => {
      const { getAllByRole } = renderWithTheme(
        <ChildSubjectTierSelector
          tiers={tiers}
          getTierSubjectValues={getTierSubjectValues}
          data-testid="test"
        />,
      );

      const foundationRadioBtn = getAllByRole("radio")[0];
      expect(foundationRadioBtn).toBeChecked();
      expect(foundationRadioBtn).toHaveAttribute("id", "foundation");
    });
    it("renders KS4 Maths: correct number of radios", () => {
      const { getAllByTestId } = renderWithTheme(
        <ChildSubjectTierSelector
          tiers={tiers}
          getTierSubjectValues={getTierSubjectValues}
          data-testid="test"
        />,
      );
      const tierRadioButtons = getAllByTestId("tier-radio-button");
      expect(tierRadioButtons).toHaveLength(2);
      expect(tierRadioButtons[0]).toHaveTextContent("Foundation");
      expect(tierRadioButtons[1]).toHaveTextContent("Higher");
    });
  });
});
