import Flex from "@/components/Flex";
import Grid, { GridArea } from "@/components/Grid";
import { LessonPathwayCard } from "@/components/Lesson/LessonPathwayCard/LessonPathwayCard";
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
      <Heading tag={headingTag}>Lesson appears in</Heading>
      {subjects.map(({ subjectTitle, units }) => {
        return units.map(({ unitTitle, unitSlug, examBoards }) => {
          return (
            <Flex $flexDirection={["column"]} $mt={48}>
              <Heading tag={"h4"} $mb={16}>
                <Flex $flexDirection={["row"]} $alignItems="baseline">
                  <Span $font="body-3-bold" $color="grey6" $mr={4}>
                    UNIT{" "}
                  </Span>
                  <Span>
                    {subjectTitle} / {unitTitle}
                  </Span>
                </Flex>
              </Heading>
              <Grid $rg={16} $cg={16}>
                {examBoards.map((examBoard) => {
                  return (
                    <GridArea $colSpan={[12, 6, 4]}>
                      <LessonPathwayCard
                        {...examBoard}
                        unitSlug={unitSlug}
                        headingTag={examBoardHeadingTag}
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
