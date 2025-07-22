import { OakSmallSecondaryButton } from "@oaknational/oak-components";
import { useOakConsent } from "@oaknational/oak-consent-client";

import { useTeacherShareButton } from "../TeacherShareButton/useTeacherShareButton";

import { TeacherShareButton } from "@/components/TeacherComponents/TeacherShareButton/TeacherShareButton";
import RedirectToSignUpWhenRestrictedWrapper from "@/components/TeacherComponents/RedirectToSignUpWhenRestrictedWrapper/RedirectToSignUpWhenRestrictedWrapper";
import { useCopyrightRequirements } from "@/hooks/useCopyrightRequirements";

export const TeacherShareNotesButton = ({
  isEditable,
  noteSaved,
  onTeacherNotesOpen,
  shareUrl,
  shareActivated,
  loginRequired,
  geoRestricted,
}: {
  isEditable: boolean | null;
  noteSaved: boolean;
  onTeacherNotesOpen: () => void;
  shareUrl: string | null;
  shareActivated?: () => void;
  loginRequired: boolean;
  geoRestricted: boolean;
}) => {
  const {
    showSignedOutGeoRestricted,
    showSignedOutLoginRequired,
    showGeoBlocked,
  } = useCopyrightRequirements({ geoRestricted, loginRequired });

  const contentRestricted =
    showSignedOutGeoRestricted || showSignedOutLoginRequired;
  const { handleClick } = useTeacherShareButton({
    shareUrl,
    shareActivated,
  });
  const { state } = useOakConsent();
  const cookiesNotAccepted = !!state.policyConsents.find(
    (policy) =>
      policy.consentState === "denied" || policy.consentState === "pending",
  );

  if (showGeoBlocked) return null;

  if (isEditable === false) {
    return (
      <RedirectToSignUpWhenRestrictedWrapper
        contentRestricted={contentRestricted}
      >
        <TeacherShareButton
          label="Share resources with colleague"
          variant={"secondary"}
          shareUrl={shareUrl}
          handleClick={contentRestricted ? undefined : () => handleClick()}
        />
      </RedirectToSignUpWhenRestrictedWrapper>
    );
  }

  if (isEditable === null || state.requiresInteraction) return undefined;

  return (
    <RedirectToSignUpWhenRestrictedWrapper
      contentRestricted={contentRestricted}
    >
      <OakSmallSecondaryButton
        disabled={cookiesNotAccepted}
        iconName={noteSaved ? "edit" : "share"}
        isTrailingIcon
        onClick={contentRestricted ? undefined : () => onTeacherNotesOpen()}
      >
        {noteSaved
          ? "Edit teacher note and share"
          : "Add teacher note and share"}
      </OakSmallSecondaryButton>
    </RedirectToSignUpWhenRestrictedWrapper>
  );
};
