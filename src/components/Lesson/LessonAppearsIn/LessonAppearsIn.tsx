import Flex from "@/components/Flex";
import Grid, { GridArea } from "@/components/Grid";
import { LessonPathwayCard } from "@/components/Lesson/LessonPathwayCard/LessonPathwayCard";
import { Heading, Span } from "@/components/Typography";

type LessonAppearsInProps = {
  subjects: {
    subjectTitle: string;
    subjectSlug: string;
    units: {
      unitTitle: string;
      unitSlug: string;
      examboards: {
        examboardTitle?: string | null;
        examboardSlug?: string | null;
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
  const { subjects } = props;
  return (
    <Flex $flexDirection={["column"]}>
      <Heading tag={"h3"}>Lesson appears in</Heading>
      {subjects.map(({ subjectTitle, units }) => {
        return units.map(({ unitTitle, unitSlug, examboards }) => {
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
                {examboards.map((examboard) => {
                  return (
                    <GridArea $colSpan={[12, 6, 4]}>
                      <LessonPathwayCard {...examboard} unitSlug={unitSlug} />
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
