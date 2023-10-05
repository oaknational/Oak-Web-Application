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
  numberOfLessons: number | null;
  lessons: Lesson[] | null | undefined;
};

export const CurriculumUnitDetails: FC<CurriculumUnitDetailsProps> = ({
  threads,
  numberOfLessons,
  lessons,
}) => {
  const uniqueThreads = new Set<string>();
  threads.forEach((thread) => {
    uniqueThreads.add(thread.title);
  });
  const uniqueThreadsArray = Array.from(uniqueThreads);

  const uniqueLessonTitles = new Set<string>();
  lessons?.forEach((lesson) => {
    uniqueLessonTitles.add(lesson.title);
  });
  const uniqueLessonTitlesArray = Array.from(uniqueLessonTitles);

  const lessonsInUnit = `${numberOfLessons} ${
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
      <Flex $flexDirection={"column"}>
        <Accordion title="Lessons in unit" lastAccordion={true}>
          <OL $mt={0} data-testid="lesson-title-list">
            {lessons &&
              uniqueLessonTitlesArray?.map((lesson) => {
                return <LI>{lesson}</LI>;
              })}
          </OL>
        </Accordion>
      </Flex>
    </Flex>
  );
};
