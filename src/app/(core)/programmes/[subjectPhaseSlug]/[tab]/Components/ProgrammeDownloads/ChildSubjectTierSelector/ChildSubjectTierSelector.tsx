import {
  OakFlex,
  OakInlineBanner,
  OakPrimaryButton,
  OakRadioButton,
  OakRadioGroup,
} from "@oaknational/oak-components";
import React, { useState } from "react";

export interface Tier {
  tier: string;
  tierSlug: string;
}
export interface Subject {
  subject: string;
  subjectSlug: string;
}

export type ChildSubjectTierSelectorProps = {
  /* An array of Tier objects containing `tier` and `tierSlug` */
  tiers?: Tier[];
  /* An array of Subject objects containing `subject` and `subjectSlug` */
  childSubjects?: Subject[];
  /* Callback function which returns the selected tier and subject once the Next button is pressed. */
  getTierSubjectValues: (
    tierSlug: string,
    childSubjectSlug: string | null,
  ) => void;
};

export const ChildSubjectTierSelector = (
  props: ChildSubjectTierSelectorProps,
) => {
  const { childSubjects, tiers, getTierSubjectValues } = props;

  const [childSubjectSelected, setChildSubjectSelected] = useState<
    string | null
  >(childSubjects?.[0] ? childSubjects[0]?.subjectSlug : null);
  const [tierSelected, setTierSelected] = useState<string>("foundation");

  const tiersAvailable = tiers && tierSelected.length > 0;
  const childSubjectsAvailable = childSubjects && childSubjects.length > 0;
  function handleChildSubjectSelection(
    e: React.ChangeEvent<HTMLInputElement>,
  ): void {
    const childSubjectSlug = e.currentTarget.value;
    setChildSubjectSelected(childSubjectSlug);
  }

  function handleTierSelection(e: React.ChangeEvent<HTMLInputElement>): void {
    const tierSlug = e.currentTarget.value;
    setTierSelected(tierSlug);
  }

  function handleNextClick() {
    getTierSubjectValues(tierSelected, childSubjectSelected);
  }

  return (
    <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
      <OakInlineBanner
        isOpen={true}
        message={`Before downloading, choose ${
          childSubjectsAvailable && tiersAvailable ? "options" : "an option"
        } for KS4. The document will still display both KS3 and KS4.`}
        $maxWidth={"spacing-640"}
      />
      {childSubjectsAvailable && (
        <OakRadioGroup
          label="Choose subject for KS4 units"
          name="childSubjectRadio"
          onChange={handleChildSubjectSelection}
          $flexDirection={"column"}
          $gap={"spacing-16"}
          defaultValue={childSubjectSelected || "combined-science"}
          data-testid="child-subject-selector"
        >
          {childSubjects.map(({ subject, subjectSlug }) => (
            <OakRadioButton
              id={subjectSlug}
              label={subject}
              value={subjectSlug}
              data-testid="child-subject-radio-button"
              key={subjectSlug}
            />
          ))}
        </OakRadioGroup>
      )}
      {tiersAvailable && (
        <OakRadioGroup
          data-testid="tier-selector"
          label="Choose learning tier for KS4 units"
          name="tierRadio"
          onChange={handleTierSelection}
          $flexDirection={"column"}
          $gap={"spacing-16"}
          defaultValue={tierSelected}
        >
          {tiers.map(({ tier, tierSlug }) => (
            <OakRadioButton
              id={tierSlug}
              label={tier}
              value={tierSlug}
              data-testid="tier-radio-button"
              key={tierSlug}
            />
          ))}
        </OakRadioGroup>
      )}
      <OakPrimaryButton
        iconName="arrow-right"
        isTrailingIcon={true}
        onClick={handleNextClick}
      >
        Next
      </OakPrimaryButton>
    </OakFlex>
  );
};
