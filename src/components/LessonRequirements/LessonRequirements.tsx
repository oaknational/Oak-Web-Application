import React, { FC } from "react";

import LessonRequirementsHeading from "./LessonRequirementsHeading";

import { IconName } from "@/components/Icon";
import Flex from "@/components/Flex";
import { P, UL, LI } from "@/components/Typography";

type LessonRequirementsProps = {
  helperIcon: IconName;
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

const LessonRequirements: FC<LessonRequirementsProps> = ({
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
    <Flex $flexDirection={"column"} $justifyContent={"center"} $gap={8}>
      <LessonRequirementsHeading helperIcon={helperIcon} heading={heading} />
      {contentGuidance && (
        <UL $reset>
          {removedGuidanceDuplicates.map((guidance: string) => {
            return (
              <LI $font={"body-2"} key={guidance}>
                {guidance}
              </LI>
            );
          })}
        </UL>
      )}
      {supervisionLevel && <P $font={"body-2"}>{supervisionLevel}</P>}
      {equipment &&
        equipment.map(({ equipment }) => {
          return (
            <P $font={"body-2"} key={equipment}>
              {equipment}
            </P>
          );
        })}
    </Flex>
  );
};

export default LessonRequirements;
