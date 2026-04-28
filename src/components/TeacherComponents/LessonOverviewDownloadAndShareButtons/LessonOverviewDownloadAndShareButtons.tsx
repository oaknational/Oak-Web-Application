import { FC } from "react";
import { OakUL, OakLI } from "@oaknational/oak-components";

import { LessonOverviewCreateWithAiDropdown } from "../LessonOverviewCreateWithAiDropdown";

import { LessonOverviewDownloadAllButton } from "@/components/TeacherComponents/LessonOverviewDownloadAllButton";
import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";

interface LessonOverviewDownloadAndShareButtonsProps
  extends LessonOverviewHeaderProps {
  shareButtons: React.ReactNode;
}

export const LessonOverviewDownloadAndShareButtons: FC<
  LessonOverviewDownloadAndShareButtonsProps
> = ({ shareButtons, excludedFromTeachingMaterials, ...props }) => (
  <OakUL
    $display={"flex"}
    $flexDirection={["column", "row"]}
    $flexWrap={"wrap"}
    $pa={"spacing-0"}
    $gap={["spacing-24", "spacing-16"]}
  >
    <OakLI $listStyle={"none"}>
      <LessonOverviewDownloadAllButton {...props} />
    </OakLI>
    {shareButtons}
    {!excludedFromTeachingMaterials && (
      <OakLI $listStyle={"none"}>
        <LessonOverviewCreateWithAiDropdown {...props} />
      </OakLI>
    )}
  </OakUL>
);
