"use client";

import React from "react";
import { OakFlex } from "@oaknational/oak-components";

import SubjectIconBrushBoarders from "@/components/TeacherComponents/SubjectIconBrushBorders";

export const GoogleClassroomSubjectIconHeader = ({
  pageType,
  subjectSlug,
}: {
  pageType: "unit" | "lesson";
  subjectSlug: string | null;
}) => {
  return (
    <OakFlex
      $height={["spacing-80", "spacing-160"]}
      $justifyContent={"flex-start"}
    >
      <SubjectIconBrushBoarders
        subjectSlug={subjectSlug}
        color={pageType === "unit" ? "lavender" : "pink"}
        isNew={false}
      />
    </OakFlex>
  );
};
