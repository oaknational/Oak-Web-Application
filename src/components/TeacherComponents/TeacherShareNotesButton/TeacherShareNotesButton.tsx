import {
  OakSmallPrimaryInvertedButton,
  OakSmallSecondaryButton,
} from "@oaknational/oak-components";
import { useOakConsent } from "@oaknational/oak-consent-client";

import { useTeacherShareButton } from "../TeacherShareButton/useTeacherShareButton";

import { TeacherShareButton } from "@/components/TeacherComponents/TeacherShareButton/TeacherShareButton";
import { useCopyrightRequirements } from "@/hooks/useCopyrightRequirements";

export const TeacherShareNotesButton = ({
  isEditable,
  noteSaved,
  onTeacherNotesOpen,
  shareUrl,
  shareActivated,
  loginRequired,
  geoRestricted,
  variant = "secondary",
}: {
  isEditable: boolean | null;
  noteSaved: boolean;
  onTeacherNotesOpen: () => void;
  shareUrl: string | null;
  shareActivated?: () => void;
  loginRequired: boolean;
  geoRestricted: boolean;
  variant?: "secondary" | "primary" | "dropdown";
}) => {
  const { showGeoBlocked } = useCopyrightRequirements({
    geoRestricted,
    loginRequired,
  });

  const OakButton =
    variant === "dropdown"
      ? OakSmallPrimaryInvertedButton
      : OakSmallSecondaryButton;
  const { state } = useOakConsent();
  const { handleClick } = useTeacherShareButton({
    shareUrl,
    shareActivated,
  });
  if (showGeoBlocked) return null;
  const cookiesNotAccepted = !!state.policyConsents.find(
    (policy) =>
      policy.consentState === "denied" || policy.consentState === "pending",
  );
  if (isEditable === false) {
    return (
      <TeacherShareButton
        label="Share resources with colleague"
        variant={variant}
        shareUrl={shareUrl}
        handleClick={handleClick}
      />
    );
  }

  if (isEditable === null || state.requiresInteraction) return undefined;

  return (
    <OakButton
      disabled={cookiesNotAccepted}
      iconName={noteSaved ? "edit" : "share"}
      isTrailingIcon
      onClick={onTeacherNotesOpen}
    >
      {noteSaved ? "Edit teacher note and share" : "Add teacher note and share"}
    </OakButton>
  );
};
