import React from "react";
import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/react";

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
      const { getByRole } = renderWithTheme(
        <ChildSubjectTierSelector
          tiers={tiers}
          childSubjects={childSubjects}
          getTierSubjectValues={getTierSubjectValues}
          data-testid="test"
        />,
      );

      const biologyRadioButton = getByRole("radio", { name: "Biology" });
      expect(biologyRadioButton).toBeChecked();
    });

    it("passes default values when Next is clicked", () => {
      const { getByRole } = renderWithTheme(
        <ChildSubjectTierSelector
          tiers={tiers}
          childSubjects={childSubjects}
          getTierSubjectValues={getTierSubjectValues}
        />,
      );

      fireEvent.click(getByRole("button", { name: "Next step" }));
      expect(getTierSubjectValues).toHaveBeenCalledWith(
        "foundation",
        "biology",
      );
    });

    it("passes selected tier and subject when Next is clicked", () => {
      const { getByRole } = renderWithTheme(
        <ChildSubjectTierSelector
          tiers={tiers}
          childSubjects={childSubjects}
          getTierSubjectValues={getTierSubjectValues}
        />,
      );

      fireEvent.click(getByRole("radio", { name: "Physics" }));
      fireEvent.click(getByRole("radio", { name: "Higher" }));
      fireEvent.click(getByRole("button", { name: "Next step" }));

      expect(getTierSubjectValues).toHaveBeenCalledWith("higher", "physics");
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
      const { getByRole } = renderWithTheme(
        <ChildSubjectTierSelector
          tiers={tiers}
          getTierSubjectValues={getTierSubjectValues}
          data-testid="test"
        />,
      );

      const foundationRadioBtn = getByRole("radio", { name: "Foundation" });
      expect(foundationRadioBtn).toBeChecked();
    });
    it("renders KS4 Maths: correct number of radios", () => {
      const { getAllByRole } = renderWithTheme(
        <ChildSubjectTierSelector
          tiers={tiers}
          getTierSubjectValues={getTierSubjectValues}
          data-testid="test"
        />,
      );
      const tierRadioButtons = getAllByRole("radio");
      expect(tierRadioButtons).toHaveLength(2);
      expect(tierRadioButtons[0]).toHaveAccessibleName("Foundation");
      expect(tierRadioButtons[1]).toHaveAccessibleName("Higher");
    });

    it("passes null child subject when no child subjects are provided", () => {
      const { getByRole } = renderWithTheme(
        <ChildSubjectTierSelector
          tiers={tiers}
          getTierSubjectValues={getTierSubjectValues}
        />,
      );

      fireEvent.click(getByRole("button", { name: "Next step" }));
      expect(getTierSubjectValues).toHaveBeenCalledWith("foundation", null);
    });
  });

  describe("conditional rendering", () => {
    it("renders only child subject selector when tiers are missing", () => {
      const { getByTestId, queryByTestId } = renderWithTheme(
        <ChildSubjectTierSelector
          childSubjects={childSubjects}
          getTierSubjectValues={getTierSubjectValues}
        />,
      );

      expect(getByTestId("child-subject-selector")).toBeInTheDocument();
      expect(queryByTestId("tier-selector")).not.toBeInTheDocument();
    });
  });
});
