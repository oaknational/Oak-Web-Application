import { OakSmallSecondaryButton } from "@oaknational/oak-components";
import { useOakConsent } from "@oaknational/oak-consent-client";

export const TeacherShareNotesButton = ({
  isEditable,
  noteSaved,
  onTeacherNotesOpen,
}: {
  isEditable: boolean | null;
  noteSaved: boolean;
  onTeacherNotesOpen: () => void;
}) => {
  const { state } = useOakConsent();
  const cookiesNotAccepted = !!state.policyConsents.find(
    (policy) =>
      policy.consentState === "denied" || policy.consentState === "pending",
  );

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
