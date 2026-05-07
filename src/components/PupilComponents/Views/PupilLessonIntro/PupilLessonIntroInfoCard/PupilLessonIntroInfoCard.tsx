import React from "react";
import { OakCardHeader, OakLessonInfoCard } from "@oaknational/oak-components";

type CardHeaderIconName = React.ComponentProps<
  typeof OakCardHeader
>["iconName"];

export type PupilLessonIntroInfoCardProps = {
  title: string;
  iconName: CardHeaderIconName;
  children: React.ReactNode;
};

export const PupilLessonIntroInfoCard = ({
  title,
  iconName,
  children,
}: PupilLessonIntroInfoCardProps) => {
  return (
    <OakLessonInfoCard>
      <OakCardHeader iconName={iconName} tag="h2">
        {title}
      </OakCardHeader>
      {children}
    </OakLessonInfoCard>
  );
};
