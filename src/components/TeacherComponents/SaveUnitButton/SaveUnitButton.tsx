import {
  OakSmallPrimaryButton,
  OakSmallTertiaryInvertedButton,
} from "@oaknational/oak-components";
import styled from "styled-components";

import SavingSignedOutModal from "../SavingSignedOutModal";

import { useSaveUnits } from "@/node-lib/educator-api/helpers/saveUnits/useSaveUnits";
import { TrackingProgrammeData } from "@/node-lib/educator-api/helpers/saveUnits/utils";

type SaveButtonProps = {
  buttonVariant: "default" | "inverted";
  programmeSlug: string;
  unitSlug: string;
  unitTitle: string;
  disabled?: boolean;
  trackingProps: TrackingProgrammeData;
};

const StyledSmallPrimaryButton = styled(OakSmallPrimaryButton)`
  span {
    font-weight: unset;
    font-size: unset;
  }
  button {
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    border: none;
  }
`;

export const SaveUnitButton = ({
  buttonVariant,
  programmeSlug,
  unitSlug,
  unitTitle,
  disabled,
  trackingProps,
}: SaveButtonProps) => {
  const { isUnitSaved, onSaveToggle, isUnitSaving, showSignIn, setShowSignIn } =
    useSaveUnits(programmeSlug, trackingProps);

  const buttonProps = {
    isTrailingIcon: true,
    "aria-disabled": disabled || isUnitSaving(unitSlug),
    disabled: disabled || isUnitSaving(unitSlug),
    onClick: () => onSaveToggle(unitSlug),
    $justifyContent: "end",
    "aria-label": `${isUnitSaved(unitSlug) ? "Unsave" : "Save"} this unit: ${unitTitle} `,
  };

  const iconName = isUnitSaved(unitSlug)
    ? "bookmark-filled"
    : "bookmark-outlined";

  if (showSignIn) {
    return (
      <SavingSignedOutModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
      />
    );
  }

  return buttonVariant === "inverted" ? (
    <StyledSmallPrimaryButton {...buttonProps} iconName={iconName}>
      {isUnitSaved(unitSlug) ? "Saved" : "Save"}
    </StyledSmallPrimaryButton>
  ) : (
    <OakSmallTertiaryInvertedButton {...buttonProps} iconName={iconName}>
      {isUnitSaved(unitSlug) ? "Saved" : "Save"}
    </OakSmallTertiaryInvertedButton>
  );
};
