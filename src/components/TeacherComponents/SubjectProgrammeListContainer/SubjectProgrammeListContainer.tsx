import { FC } from "react";

import { LessonItemContainerProps } from "../SubjectProgrammeListing/SubjectProgrammeListing";

import { GridArea } from "@/components/SharedComponents/Grid";
import { OakColorName } from "@/styles/theme";

const SubjectProgrammeListContainer: FC<
  LessonItemContainerProps & { $background?: OakColorName }
> = (props) => {
  const {
    children,
    numberOfProgrammes,
    $background = "lavender30",
    ...gridAreaProps
  } = props;
  return (
    <GridArea
      $background={$background}
      $pa={16}
      $borderRadius={4}
      {...gridAreaProps}
    >
      {children}
    </GridArea>
  );
};

export default SubjectProgrammeListContainer;
