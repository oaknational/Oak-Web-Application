import { FC } from "react";

import Flex from "@/components/Flex";
import Box from "@/components/Box";
import { Heading, LI, P, OL } from "@/components/Typography";
import { TagFunctional } from "@/components/TagFunctional";
import { Lesson } from "@/components/UnitModal/UnitModal";
import { Thread } from "@/components/pages/CurriculumInfo/tabs/UnitsTab/UnitsTab";
import Accordion from "@/components/Accordion";

export type CurriculumUnitDetailsProps = {
  unitTitle?: string;
  threads: Thread[];
  lessons: Lesson[] | null | undefined;
  previousUnitDescription: string | null;
  futureUnitDescription: string | null;
};

export const CurriculumUnitDetails: FC<CurriculumUnitDetailsProps> = ({
  threads,
  lessons,
  previousUnitDescription,
  futureUnitDescription,
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
          <Accordion title="Lessons in unit">
            <OL $mt={0} data-testid="lesson-title-list">
              {lessons &&
                uniqueLessonTitlesArray?.map((lesson) => {
                  return <LI key={lesson}>{lesson}</LI>;
                })}
            </OL>
          </Accordion>
        )}

        {previousUnitDescription && (
          <Accordion title="Previous unit description">
            <P $mb={12} $font={"body-2-bold"}>
              Title
            </P>
            <P $mb={12} $font={"body-2"}>
              {previousUnitDescription}
            </P>
          </Accordion>
        )}

        {futureUnitDescription && (
          <Accordion title="Following unit description" lastAccordion={true}>
            <P $mb={12} $font={"body-2-bold"}>
              Title
            </P>
            <P $mb={12} $font={"body-2"}>
              {futureUnitDescription}
            </P>
          </Accordion>
        )}
      </Flex>
    </Flex>
  );
};
