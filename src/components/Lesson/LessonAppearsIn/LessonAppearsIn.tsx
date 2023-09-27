import Flex from "@/components/Flex";
import Grid, { GridArea } from "@/components/Grid";
import { LessonPathwayCard } from "@/components/Lesson/LessonPathwayCard/LessonPathwayCard";
import { TagFunctional } from "@/components/TagFunctional";
import { TagColor } from "@/components/TagFunctional/TagFunctional";
import {
  Heading,
  HeadingTag,
  Span,
  getNextHeadingTag,
} from "@/components/Typography";

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
              <Grid $rg={16} $cg={16}>
                {examBoards.map((examBoard, index) => {
                  const tagColors: TagColor[] = ["aqua", "pink", "yellow"];
                  const tagColor =
                    tagColors[index % tagColors.length] || "aqua";

                  return (
                    <GridArea
                      key={`LessonAppearsIn-s-${subjectSlug}-u-${unitSlug}-e-${examBoard.examBoardSlug}`}
                      $colSpan={[12, 6, 4]}
                    >
                      <LessonPathwayCard
                        {...examBoard}
                        unitSlug={unitSlug}
                        headingTag={examBoardHeadingTag}
                        examBoardTagColor={tagColor}
                      />
                    </GridArea>
                  );
                })}
              </Grid>
            </Flex>
          );
        });
      })}
    </Flex>
  );
}
