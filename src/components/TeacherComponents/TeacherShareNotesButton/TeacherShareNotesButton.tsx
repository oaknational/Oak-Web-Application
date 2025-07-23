import { OakSmallSecondaryButton } from "@oaknational/oak-components";
import { useOakConsent } from "@oaknational/oak-consent-client";

import { useTeacherShareButton } from "../TeacherShareButton/useTeacherShareButton";

import { TeacherShareButton } from "@/components/TeacherComponents/TeacherShareButton/TeacherShareButton";
import RedirectOrHideWhenRestrictedWrapper from "@/components/TeacherComponents/RedirectOrHideWhenRestrictedWrapper/RedirectOrHideWhenRestrictedWrapper";
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

  if (isEditable === false) {
    return (
      <RedirectOrHideWhenRestrictedWrapper
        showGeoBlocked={showGeoBlocked}
        contentRestricted={contentRestricted}
      >
        <TeacherShareButton
          label="Share resources with colleague"
          variant={"secondary"}
          shareUrl={shareUrl}
          handleClick={contentRestricted ? undefined : () => handleClick()}
        />
      </RedirectOrHideWhenRestrictedWrapper>
    );
  }

  if (isEditable === null || state.requiresInteraction) return undefined;

  return (
    <RedirectOrHideWhenRestrictedWrapper
      showGeoBlocked={showGeoBlocked}
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
    </RedirectOrHideWhenRestrictedWrapper>
  );
};
