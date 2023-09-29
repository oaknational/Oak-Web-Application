import { FC } from "react";

import { TagFunctional } from "@/components/TagFunctional";
import Flex from "@/components/Flex";
import { P } from "@/components/Typography";
import Svg from "@/components/Svg";

type LessonMetadataProps = {
  keyStageTitle?: string;
  year?: string;
  subjectTitle?: string;
  units?: boolean;
  lessons?: boolean;
};

const DotSeparator = () => <Svg name="dot" $width={6} $mh={8} />;

const LessonMetadata: FC<LessonMetadataProps> = ({
  keyStageTitle,
  year,
  subjectTitle,
  units,
  lessons,
}) => {
  const yearTitle = `Year ${year}`;

  return (
    <Flex
      $flexDirection={"row"}
      $font={"body-1"}
      $color={"oakGrey4"}
      $maxHeight={24}
      $alignItems={"center"}
      $mb={8}
    >
      {keyStageTitle && (
        <>
          <P>{keyStageTitle}</P> <DotSeparator />
        </>
      )}
      {year && (
        <>
          <P>{yearTitle}</P>
          <DotSeparator />
        </>
      )}
      {subjectTitle && (
        <>
          <P>{subjectTitle}</P>
        </>
      )}
      {units && (
        <>
          <DotSeparator />
          <P>Units</P>
          <DotSeparator />
          <TagFunctional text={"Unit"} color={"blue"} />
        </>
      )}
      {lessons && (
        <>
          <DotSeparator />
          <P>Lessons</P>
          <DotSeparator />
          <TagFunctional text={"Lesson"} color={"pink"} />
        </>
      )}
    </Flex>
  );
};

export default LessonMetadata;
