import { OakGrid, OakGridArea } from "@oak-academy/oak-components";

import Flex from "@/components/SharedComponents/Flex";
import { LessonAppearsInPathwayCard } from "@/components/TeacherComponents/LessonAppearsInPathwayCard";
import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import { TagColor } from "@/components/SharedComponents/TagFunctional/TagFunctional";
import {
  Heading,
  HeadingTag,
  Span,
  getNextHeadingTag,
} from "@/components/SharedComponents/Typography";

type LessonAppearsInProps = {
  headingTag: HeadingTag;
  subjects: {
    subjectTitle: string;
    subjectSlug: string;
    units: {
      unitTitle: string;
      unitSlug: string;
      examBoards: {
        examBoardTitle?: string | null;
        examBoardSlug?: string | null;
        subjectTitle: string;
        subjectSlug: string;
        tiers: {
          programmeSlug: string;
          tierTitle?: string | null;
          tierSlug?: string | null;
        }[];
      }[];
    }[];
  }[];
};

export function LessonAppearsIn(props: LessonAppearsInProps) {
  const { headingTag, subjects } = props;
  const unitHeadingTag = getNextHeadingTag(headingTag);
  const examBoardHeadingTag = getNextHeadingTag(unitHeadingTag);

  return (
    <Flex $flexDirection={["column"]}>
      <Heading $font={"heading-5"} tag={headingTag}>
        Lesson appears in
      </Heading>
      {subjects.map(({ subjectTitle, subjectSlug, units }) => {
        return units.map(({ unitTitle, unitSlug, examBoards }) => {
          return (
            <Flex
              key={`LessonAppearsIn-s-${subjectSlug}-u-${unitSlug}`}
              $flexDirection={["column"]}
              $mt={48}
            >
              <Heading tag={unitHeadingTag} $mb={16}>
                <Flex $flexDirection={["row"]} $alignItems="baseline">
                  <TagFunctional text="Unit" color="grey" $mr={12} />
                  <Span $font="heading-light-6">
                    {subjectTitle} / {unitTitle}
                  </Span>
                </Flex>
              </Heading>
              <OakGrid $rg={"all-spacing-4"} $cg={"all-spacing-4"}>
                {examBoards.map((examBoard, index) => {
                  const tagColors: TagColor[] = ["aqua", "pink", "lemon"];
                  const tagColor =
                    tagColors[index % tagColors.length] || "aqua";

                  return (
                    <OakGridArea
                      key={`LessonAppearsIn-s-${subjectSlug}-u-${unitSlug}-e-${examBoard.examBoardSlug}`}
                      $colSpan={[12, 6, 4]}
                    >
                      <LessonAppearsInPathwayCard
                        {...examBoard}
                        unitSlug={unitSlug}
                        headingTag={examBoardHeadingTag}
                        examBoardTagColor={tagColor}
                      />
                    </OakGridArea>
                  );
                })}
              </OakGrid>
            </Flex>
          );
        });
      })}
    </Flex>
  );
}
