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

    it("passes default values when Next is clicked", () => {
      const { getByRole } = renderWithTheme(
        <ChildSubjectTierSelector
          tiers={tiers}
          childSubjects={childSubjects}
          getTierSubjectValues={getTierSubjectValues}
        />,
      );

      fireEvent.click(getByRole("button", { name: "Next" }));
      expect(getTierSubjectValues).toHaveBeenCalledWith(
        "foundation",
        "biology",
      );
    });

    it("passes selected tier and subject when Next is clicked", () => {
      const { getByLabelText, getByRole } = renderWithTheme(
        <ChildSubjectTierSelector
          tiers={tiers}
          childSubjects={childSubjects}
          getTierSubjectValues={getTierSubjectValues}
        />,
      );

      fireEvent.click(getByLabelText("Physics"));
      fireEvent.click(getByLabelText("Higher"));
      fireEvent.click(getByRole("button", { name: "Next" }));

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

    it("passes null child subject when no child subjects are provided", () => {
      const { getByRole } = renderWithTheme(
        <ChildSubjectTierSelector
          tiers={tiers}
          getTierSubjectValues={getTierSubjectValues}
        />,
      );

      fireEvent.click(getByRole("button", { name: "Next" }));
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

    it("shows singular banner copy when one option group is available", () => {
      const { getByText } = renderWithTheme(
        <ChildSubjectTierSelector
          childSubjects={childSubjects}
          getTierSubjectValues={getTierSubjectValues}
        />,
      );

      expect(
        getByText(
          "Before downloading, choose an option for KS4. The document will still display both KS3 and KS4.",
        ),
      ).toBeInTheDocument();
    });

    it("shows singular banner copy when no option groups are available", () => {
      const { getByText } = renderWithTheme(
        <ChildSubjectTierSelector
          getTierSubjectValues={getTierSubjectValues}
        />,
      );

      expect(
        getByText(
          "Before downloading, choose an option for KS4. The document will still display both KS3 and KS4.",
        ),
      ).toBeInTheDocument();
    });
  });
});
