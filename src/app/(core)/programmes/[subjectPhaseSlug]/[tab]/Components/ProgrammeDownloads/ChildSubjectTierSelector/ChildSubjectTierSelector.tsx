import {
  OakBox,
  OakFlex,
  OakInlineBanner,
  OakPrimaryButton,
  OakRadioAsButton,
  OakRadioGroup,
} from "@oaknational/oak-components";
import React, { useState } from "react";

import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";

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
    <OakFlex $flexDirection={"column"}>
      <OakInlineBanner
        isOpen={true}
        icon="bell"
        type="alert"
        title="Choose your KS4 downlod options below."
        message="Your subject and tier selections will change the file you download. The document will still display both KS3 and KS4."
        $mb="spacing-32"
      />
      <OakFlex
        $flexDirection={"column"}
        $gap="spacing-32"
        $maxWidth="spacing-240"
      >
        {childSubjectsAvailable && (
          <OakRadioGroup
            name="childSubjectRadio"
            onChange={handleChildSubjectSelection}
            $flexDirection="row"
            $flexWrap="wrap"
            $gap="spacing-12"
            defaultValue={childSubjectSelected || "combined-science"}
            data-testid="child-subject-selector"
          >
            <OakBox as="legend" $font="heading-7" $mb="spacing-24">
              Choose subject for KS4 units
            </OakBox>
            {childSubjects.map(({ subject, subjectSlug }) => (
              <OakRadioAsButton
                variant="with-icon"
                icon={getValidSubjectIconName(subjectSlug)}
                displayValue={subject}
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
            name="tierRadio"
            onChange={handleTierSelection}
            $flexDirection="row"
            $gap="spacing-12"
            defaultValue={tierSelected}
            $flexWrap="wrap"
          >
            <OakBox as="legend" $font="heading-7" $mb="spacing-24">
              Choose learning tier for KS4 units
            </OakBox>
            {tiers.map(({ tier, tierSlug }) => (
              <OakRadioAsButton
                displayValue={tier}
                value={tierSlug}
                data-testid="tier-radio-button"
                key={tierSlug}
              />
            ))}
          </OakRadioGroup>
        )}
      </OakFlex>
      <OakBox $mt="spacing-48">
        <OakPrimaryButton
          iconName="arrow-right"
          isTrailingIcon={true}
          onClick={handleNextClick}
        >
          Next step
        </OakPrimaryButton>
      </OakBox>
    </OakFlex>
  );
};
