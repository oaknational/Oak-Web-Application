import { OakP } from "@oaknational/oak-components";

import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

export const SavedToastProps = {
  message: (
    <OakP>
      <b>Unit saved</b> to My library
    </OakP>
  ),
  variant: "green" as const,
  showIcon: true,
  autoDismiss: true,
};

export const UnsavedToastProps = {
  message: (
    <OakP>
      <b>Unit removed</b> from My library
    </OakP>
  ),
  variant: "dark" as const,
  showIcon: false,
  autoDismiss: true,
};
export const ErrorToastProps = {
  message: <OakP>Something went wrong</OakP>,
  variant: "error" as const,
  showIcon: false,
  autoDismiss: true,
};

export type TrackingProgrammeData = {
  savedFrom:
    | "lesson_listing_save_button"
    | "unit_listing_save_button"
    | "my-library-save-button";
  keyStageTitle: KeyStageTitleValueType | undefined;
  keyStageSlug: string | undefined;
  subjectTitle: string;
  subjectSlug: string;
};
