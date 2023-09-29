import React, { FC } from "react";

import CopyrightNotice from "../DownloadComponents/CopyrightNotice";

import Icon, { IconName } from "@/components/Icon";
import Flex from "@/components/Flex";
import { Heading, P, UL, LI } from "@/components/Typography";

type LessonRequirementsProps = {
  helperIcon: IconName;
  heading: string;
  contentGuidance?: ContentGuidance[] | null | undefined;
  equipment?: Equipment[] | null | undefined;
  supervisionLevel?: string | null | undefined;
  isLegacyLicense?: boolean;
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
  isLegacyLicense,
}) => {
  if (
    !contentGuidance &&
    !equipment &&
    !supervisionLevel &&
    isLegacyLicense === undefined
  ) {
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
      <Flex $flexDirection={"row"} $alignItems={"center"}>
        <Icon name={helperIcon} variant="minimal" $mr={8} />
        <Heading $font={"heading-7"} tag="h3">
          {heading}
        </Heading>
      </Flex>
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

      <CopyrightNotice
        $font={"body-2"}
        showPostAlbCopyright={!isLegacyLicense}
      />
    </Flex>
  );
};

export default LessonRequirements;
