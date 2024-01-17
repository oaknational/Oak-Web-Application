import { FC } from "react";

import Flex from "@/components/SharedComponents/Flex";
import Box from "@/components/SharedComponents/Box";
import { Heading, LI, P, OL } from "@/components/SharedComponents/Typography";
import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import { Lesson } from "@/components/CurriculumComponents/UnitModal/UnitModal";
import { Thread } from "@/components/CurriculumComponents/UnitsTab/UnitsTab";
import CurriculumUnitDetailsAccordion from "@/components/CurriculumComponents/CurriculumUnitDetailsAccordion";

export type CurriculumUnitDetailsProps = {
  unitTitle?: string;
  threads: Thread[];
  lessons: Lesson[] | null | undefined;
  priorUnitDescription: string | null;
  futureUnitDescription: string | null;
  priorUnitTitle: string | null;
  futureUnitTitle: string | null;
};

export const CurriculumUnitDetails: FC<CurriculumUnitDetailsProps> = ({
  threads,
  lessons,
  priorUnitDescription,
  futureUnitDescription,
  priorUnitTitle,
  futureUnitTitle,
}) => {
  const threadTitleSet = new Set<string>(threads.map((thread) => thread.title));

  const lessonTitleSet = new Set<string>(
    lessons?.map((lesson) => lesson.title),
  );

  const uniqueThreadsArray = Array.from(threadTitleSet);
  const uniqueLessonTitlesArray = Array.from(lessonTitleSet);
  const numberOfLessons = uniqueLessonTitlesArray.length;

  const lessonsInUnit = `${uniqueLessonTitlesArray.length} ${
    numberOfLessons === 1 ? "lesson" : "lessons"
  }`;

  return (
    <Flex
      $flexDirection={"column"}
      $width={"100%"}
      $mb={24}
      data-testid="curriculum-unit-details"
    >
      <P $mb={32} $font={"body-2"}>
        {lessonsInUnit}
      </P>

      {uniqueThreadsArray.length >= 1 && (
        <Box $mb={[24, 32]}>
          <Heading tag="h3" $font={"heading-6"} $mb={8}>
            Threads
          </Heading>
          <Flex
            $flexDirection={["column", "row"]}
            $flexWrap={"wrap"}
            $gap={8}
            $alignItems={"flex-start"}
          >
            {uniqueThreadsArray.map((thread) => (
              <TagFunctional
                key={thread}
                text={thread}
                color={"grey"}
                data-testid="thread-tag"
              />
            ))}
          </Flex>
        </Box>
      )}
      <Flex $flexDirection={"column"}>
        {numberOfLessons >= 1 && (
          <CurriculumUnitDetailsAccordion title="Lessons in unit">
            <OL $mt={0} data-testid="lesson-title-list">
              {lessons &&
                uniqueLessonTitlesArray?.map((lesson) => {
                  return <LI key={lesson}>{lesson}</LI>;
                })}
            </OL>
          </CurriculumUnitDetailsAccordion>
        )}

        {priorUnitDescription && (
          <CurriculumUnitDetailsAccordion title="Previous unit description">
            <P $mb={12} $font={"body-2-bold"}>
              {priorUnitTitle}
            </P>
            <P $mb={12} $font={"body-2"}>
              {priorUnitDescription}
            </P>
          </CurriculumUnitDetailsAccordion>
        )}

        {futureUnitDescription && (
          <CurriculumUnitDetailsAccordion
            title="Following unit description"
            lastAccordion={true}
          >
            <P $mb={12} $font={"body-2-bold"}>
              {futureUnitTitle}
            </P>
            <P $mb={12} $font={"body-2"}>
              {futureUnitDescription}
            </P>
          </CurriculumUnitDetailsAccordion>
        )}
      </Flex>
    </Flex>
  );
};
