import React from "react";
import { OakLessonTopNav } from "@oaknational/oak-components";

export type PupilLessonVideoTopNavProps = {
  backLinkSlot?: React.ReactNode;
  heading?: string;
  mobileSummary?: React.ReactNode;
};

export const PupilLessonVideoTopNav = ({
  backLinkSlot,
  heading = "Lesson video",
  mobileSummary = "In progress...",
}: PupilLessonVideoTopNavProps) => {
  return (
    <OakLessonTopNav
      backLinkSlot={backLinkSlot}
      heading={heading}
      lessonSectionName="video"
      mobileSummary={mobileSummary}
    />
  );
};
