import { useState } from "react";
import {
  OakPupilContentGuidance,
  OakPupilJourneyContentGuidance,
  OakPupilJourneyContentGuidanceProps,
} from "@oaknational/oak-components";

import { ContentGuidanceWarningValueType } from "@/browser-lib/avo/Avo";
import { getAgeRestrictionString } from "@/components/PupilComponents/Views/ViewHelpers";

export type ContentGuidanceTrackingArgs = {
  supervisionLevel: string;
  contentGuidanceWarning: ContentGuidanceWarningValueType;
  ageRestriction: string;
};

type PupilLessonOverviewContentGuidanceModalProps = {
  redirectOverlayCleared: boolean;
  contentGuidance: OakPupilContentGuidance[] | null | undefined;
  supervisionLevel: string | null | undefined;
  ageRestriction: string | null | undefined;
  isClassroomAssignment: boolean | null;
  onAccept: (args: ContentGuidanceTrackingArgs) => void;
  onDecline: (args: ContentGuidanceTrackingArgs) => void;
};

const defaultContentGuidance: OakPupilContentGuidance[] = [
  {
    contentguidanceLabel: "Speak to an adult before starting this lesson.",
    contentguidanceDescription: null,
    contentguidanceArea: null,
  },
];

export const PupilLessonOverviewContentGuidanceModal = ({
  redirectOverlayCleared,
  contentGuidance,
  supervisionLevel,
  ageRestriction,
  isClassroomAssignment,
  onAccept,
  onDecline,
}: PupilLessonOverviewContentGuidanceModalProps) => {
  const hasAgeRestriction = Boolean(ageRestriction);
  const [isOpen, setIsOpen] = useState<boolean>(
    Boolean(contentGuidance) || hasAgeRestriction,
  );
  const contentGuidanceWarning = contentGuidance?.find(
    (guidance) => guidance.contentguidanceArea,
  )?.contentguidanceArea as ContentGuidanceWarningValueType;
  const trackingArgs = {
    supervisionLevel: supervisionLevel || "",
    contentGuidanceWarning,
    ageRestriction: ageRestriction ?? "all",
  };
  const isModalOpen = isOpen && redirectOverlayCleared;
  const declineIcon = isClassroomAssignment ? "cross" : undefined;
  const declineText = isClassroomAssignment ? "Exit lesson" : undefined;
  const handleAccept = () => {
    setIsOpen(false);
    onAccept(trackingArgs);
  };
  const ageRestrictionProps: Partial<OakPupilJourneyContentGuidanceProps> = {
    contentGuidance: contentGuidance ?? defaultContentGuidance,
    supervisionLevel: contentGuidance ? supervisionLevel : null,
  };
  const otherContentGuidanceProps: Partial<OakPupilJourneyContentGuidanceProps> =
    {
      contentGuidance: contentGuidance ?? null,
      supervisionLevel: supervisionLevel,
    };

  return (
    <OakPupilJourneyContentGuidance
      isOpen={isModalOpen}
      onAccept={handleAccept}
      onDecline={() => onDecline(trackingArgs)}
      declineIcon={declineIcon}
      declineText={declineText}
      title={
        hasAgeRestriction ? getAgeRestrictionString(ageRestriction) : undefined
      }
      {...(hasAgeRestriction ? ageRestrictionProps : otherContentGuidanceProps)}
    />
  );
};
