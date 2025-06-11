import { OakSmallSecondaryButton } from "@oaknational/oak-components";
import { useOakConsent } from "@oaknational/oak-consent-client";

import { useTeacherShareButton } from "../TeacherShareButton/useTeacherShareButton";

import { TeacherShareButton } from "@/components/TeacherComponents/TeacherShareButton/TeacherShareButton";

export const TeacherShareNotesButton = ({
  isEditable,
  noteSaved,
  onTeacherNotesOpen,
  shareUrl,
  shareActivated,
}: {
  isEditable: boolean | null;
  noteSaved: boolean;
  onTeacherNotesOpen: () => void;
  shareUrl: string | null;
  shareActivated?: () => void;
}) => {
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
      <>
        <TeacherShareButton
          label="Share resources with colleague"
          variant={"secondary"}
          shareUrl={shareUrl}
          handleClick={handleClick}
        />
      </>
    );
  }

  if (isEditable === null || state.requiresInteraction) return undefined;

  return (
    <OakSmallSecondaryButton
      disabled={cookiesNotAccepted}
      iconName={noteSaved ? "edit" : "share"}
      isTrailingIcon
      onClick={onTeacherNotesOpen}
    >
      {noteSaved ? "Edit teacher note and share" : "Add teacher note and share"}
    </OakSmallSecondaryButton>
  );
};
