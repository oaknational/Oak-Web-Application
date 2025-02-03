import { OakSmallSecondaryButton } from "@oaknational/oak-components";

import { TeacherShareButton } from "@/components/TeacherComponents/TeacherShareButton/TeacherShareButton";

export const TeacherShareNotesButton = ({
  teacherNotesEnabled,
  isEditable,
  noteSaved,
  onTeacherNotesOpen,
  shareUrl,
  shareActivated,
}: {
  teacherNotesEnabled: boolean;
  isEditable: boolean;
  noteSaved: boolean;
  onTeacherNotesOpen: () => void;
  shareUrl: string | null;
  shareActivated?: () => void;
}) => {
  return teacherNotesEnabled && isEditable ? (
    <OakSmallSecondaryButton
      iconName={noteSaved ? "edit" : "share"}
      isTrailingIcon
      onClick={onTeacherNotesOpen}
    >
      {noteSaved ? "Edit teacher note and share" : "Add teacher note and share"}
    </OakSmallSecondaryButton>
  ) : (
    <TeacherShareButton
      label="Share resources with colleague"
      variant={"secondary"}
      shareUrl={shareUrl}
      shareActivated={shareActivated}
    />
  );
};
