import React, { FC } from "react";
import {
  OakP,
  OakLI,
  OakUL,
  OakFlex,
  OakIconName,
} from "@oaknational/oak-components";

import LessonRequirementsHeading from "../LessonRequirementsHeading/LessonRequirementsHeading";

type LessonOverviewRequirementsProps = {
  helperIcon: OakIconName;
  heading: string;
  contentGuidance?: ContentGuidance[] | null | undefined;
  equipment?: Equipment[] | null | undefined;
  supervisionLevel?: string | null | undefined;
};

export type Equipment = {
  equipment: string;
};

export type ContentGuidance = {
  contentGuidanceLabel: string;
  contentGuidanceDescription: string;
  contentGuidanceArea: string;
};

const LessonOverviewRequirements: FC<LessonOverviewRequirementsProps> = ({
  helperIcon,
  heading,
  contentGuidance,
  equipment,
  supervisionLevel,
}) => {
  if (!contentGuidance && !equipment && !supervisionLevel) {
    return null;
  }

  const removedGuidanceDuplicates = Array.from(
    new Set(
      contentGuidance?.map(
        (guidance: ContentGuidance) => guidance.contentGuidanceLabel,
      ),
    ),
  );

  return (
    <OakFlex
      $flexDirection={"column"}
      $justifyContent={"center"}
      $gap="all-spacing-2"
    >
      <LessonRequirementsHeading helperIcon={helperIcon} heading={heading} />
      {contentGuidance && (
        <OakUL $reset>
          {removedGuidanceDuplicates.map((guidance: string) => {
            return (
              <OakLI $font={"body-2"} key={guidance}>
                {guidance}
              </OakLI>
            );
          })}
        </OakUL>
      )}
      {supervisionLevel && <OakP $font={"body-2"}>{supervisionLevel}</OakP>}
      {equipment &&
        equipment.map(({ equipment }) => {
          return (
            <OakP $font={"body-2"} key={equipment}>
              {equipment}
            </OakP>
          );
        })}
    </OakFlex>
  );
};

export default LessonOverviewRequirements;
