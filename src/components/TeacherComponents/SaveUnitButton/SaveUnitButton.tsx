import {
  OakSmallPrimaryButton,
  OakSmallTertiaryInvertedButton,
} from "@oaknational/oak-components";
import styled from "styled-components";
import { useContext } from "react";

import SavingSignedOutModal from "../SavingSignedOutModal";

import { useSaveUnits } from "@/node-lib/educator-api/helpers/saveUnits/useSaveUnits";
import { TrackingProgrammeData } from "@/node-lib/educator-api/helpers/saveUnits/utils";
import {
  SavedUnitsContext,
  SavedUnitsStore,
} from "@/context/SavedUnits/SavedUnitsStore";
import { useSharedSaveUnit } from "@/context/SavedUnits/hooks/useSharedSaveUnit";

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

export const SaveUnitButton = (props: SaveButtonProps) => {
  const store = useContext(SavedUnitsContext);

  return store ? (
    <SharedSaveUnitButton {...props} store={store} />
  ) : (
    <StandaloneSaveUnitButton {...props} />
  );
};

const SharedSaveUnitButton = ({
  store,
  ...props
}: SaveButtonProps & { store: SavedUnitsStore }) => {
  const state = useSharedSaveUnit(
    store,
    props.programmeSlug,
    props.unitSlug,
    props.trackingProps,
  );
  return <SaveUnitButtonView {...props} {...state} />;
};

const StandaloneSaveUnitButton = (props: SaveButtonProps) => {
  const { isUnitSaved, onSaveToggle, showSignIn, setShowSignIn } = useSaveUnits(
    props.programmeSlug,
    props.trackingProps,
  );

  return (
    <SaveUnitButtonView
      {...props}
      isSaved={isUnitSaved(props.unitSlug)}
      onSaveToggle={() => onSaveToggle(props.unitSlug)}
      showSignIn={showSignIn}
      setShowSignIn={setShowSignIn}
    />
  );
};

const SaveUnitButtonView = ({
  buttonVariant,
  unitTitle,
  disabled,
  isSaved,
  onSaveToggle,
  showSignIn,
  setShowSignIn,
}: SaveButtonProps & {
  isSaved: boolean;
  onSaveToggle: () => void;
  showSignIn: boolean;
  setShowSignIn: (show: boolean) => void;
}) => {
  const buttonProps = {
    isTrailingIcon: true,
    "aria-disabled": disabled,
    disabled,
    onClick: onSaveToggle,
    $justifyContent: "end",
    "aria-label": `${isSaved ? "Unsave" : "Save"} this unit: ${unitTitle} `,
  };

  const iconName = isSaved ? "bookmark-filled" : "bookmark-outlined";

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
      {isSaved ? "Saved" : "Save"}
    </StyledSmallPrimaryButton>
  ) : (
    <OakSmallTertiaryInvertedButton {...buttonProps} iconName={iconName}>
      {isSaved ? "Saved" : "Save"}
    </OakSmallTertiaryInvertedButton>
  );
};
