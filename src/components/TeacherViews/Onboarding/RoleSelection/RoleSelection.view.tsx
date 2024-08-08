import {
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakRadioButton,
  OakRadioGroup,
} from "@oaknational/oak-components";
import { useState } from "react";

const roleOptions: Record<string, string> = {
  "teacher-training": "Training to become a teacher",
  "teacher-trainer": "Teacher trainer",
  "private-tutor": "Private tutor",
  "adult-helping-child": "Adult helping a child (including homeschooling)",
  "mat-or-lea": "Working at multi-academy trust or local educational authority",
  nonprofit: "Working at an educational nonprofit",
};

const RoleSelectionView = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <OakFlex
      $flexDirection="column"
      $pa="inner-padding-xl3"
      $dropShadow="drop-shadow-standard"
      $borderRadius="border-radius-s"
      $width="all-spacing-21"
      $gap="space-between-m"
      as="form"
      onSubmit={() =>
        console.log("TODO: something with this data", selectedRole)
      }
    >
      <OakHeading tag="h2" $font="heading-light-5">
        Which of the following best describes what you do?
      </OakHeading>
      <OakRadioGroup
        name="role-selection"
        $flexDirection="column"
        $alignItems="flex-start"
        $gap="all-spacing-8"
        onChange={(event) => setSelectedRole(event.target.value)}
      >
        {Object.entries(roleOptions).map(([value, label]) => (
          <OakRadioButton key={value} id={value} label={label} value={value} />
        ))}
      </OakRadioGroup>
      <OakPrimaryButton width="100%" type="submit">
        Continue
      </OakPrimaryButton>
    </OakFlex>
  );
};

export default RoleSelectionView;
