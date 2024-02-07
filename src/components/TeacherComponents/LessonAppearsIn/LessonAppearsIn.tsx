import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakHeadingTag,
  OakSpan,
} from "@oaknational/oak-components";

import Flex from "@/components/SharedComponents/Flex";
import { LessonAppearsInPathwayCard } from "@/components/TeacherComponents/LessonAppearsInPathwayCard";
import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import { TagColor } from "@/components/SharedComponents/TagFunctional/TagFunctional";
import { getNextHeadingTag } from "@/components/SharedComponents/Typography";

type LessonAppearsInProps = {
  headingTag: OakHeadingTag;
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
      <OakHeading $font={"heading-5"} tag={headingTag}>
        Lesson appears in
      </OakHeading>
      {subjects.map(({ subjectTitle, subjectSlug, units }) => {
        return units.map(({ unitTitle, unitSlug, examBoards }) => {
          return (
            <Flex
              key={`LessonAppearsIn-s-${subjectSlug}-u-${unitSlug}`}
              $flexDirection={["column"]}
              $mt={48}
            >
              <OakHeading tag={unitHeadingTag} $mb="space-between-s">
                <Flex $flexDirection={["row"]} $alignItems="baseline">
                  <TagFunctional
                    text="Unit"
                    color="grey"
                    $mr="space-between-xs"
                  />
                  <OakSpan $font="heading-light-6">
                    {subjectTitle} / {unitTitle}
                  </OakSpan>
                </Flex>
              </OakHeading>
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
