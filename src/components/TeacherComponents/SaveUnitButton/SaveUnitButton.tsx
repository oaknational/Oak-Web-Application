import {
  OakSmallPrimaryButton,
  OakIconName,
  OakSmallTertiaryInvertedButton,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { useSaveUnits } from "@/node-lib/educator-api/helpers/saveUnits/useSaveUnits";

type SaveButtonProps = {
  buttonVariant: "default" | "inverted";
  programmeSlug: string;
  unitSlug: string;
  unitTitle: string;
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
}: SaveButtonProps) => {
  const { isUnitSaved, onSaveToggle, isUnitSaving } = useSaveUnits(
    programmeSlug,
    {
      savedFrom: "unit_listing_save_button",
      keyStageSlug: "ks1",
      keyStageTitle: "Key stage 1",
      subjectSlug: "",
      subjectTitle: "",
    },
  );

  const buttonProps = {
    iconName: isUnitSaved(unitSlug)
      ? "bookmark-filled"
      : ("bookmark-outlined" as OakIconName),
    isTrailingIcon: true,
    "aria-disabled": isUnitSaving(unitSlug),
    disabled: false, // todo: unavailable
    onClick: () => onSaveToggle(unitSlug),
    $justifyContent: "end",
    "aria-label": `${isUnitSaved(unitSlug) ? "Unsave" : "Save"} this unit: ${unitTitle} `,
  };

  return buttonVariant === "inverted" ? (
    <StyledSmallPrimaryButton {...buttonProps}>
      {isUnitSaved(unitSlug) ? "Saved" : "Save"}
    </StyledSmallPrimaryButton>
  ) : (
    <OakSmallTertiaryInvertedButton {...buttonProps}>
      {isUnitSaved(unitSlug) ? "Saved" : "Save"}
    </OakSmallTertiaryInvertedButton>
  );
};
