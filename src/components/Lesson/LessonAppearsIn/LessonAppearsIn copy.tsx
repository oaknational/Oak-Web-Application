import { groupBy } from "lodash";

import Flex from "@/components/Flex";
import { LessonPathwayCard } from "@/components/Lesson/LessonPathwayCard/LessonPathwayCard";
import { Heading, Span } from "@/components/Typography";
import { LessonPathway } from "@/components/pages/TeachersLessonOverview/teachersLessonOverview.types";
import Grid, { GridArea } from "@/components/Grid";

type LessonAppearsInProps = {
  pathways: LessonPathway[];
};

export function LessonAppearsIn(props: LessonAppearsInProps) {
  const { pathways } = props;

  const pathwaysByUnit = Object.values(groupBy(pathways, "unitSlug"));

  return (
    <Flex $flexDirection={["column"]}>
      <Heading tag={"h3"}>Lesson appears in</Heading>
      {pathwaysByUnit.map((pathways) => {
        const [firstPathway] = pathways;

        if (!firstPathway) {
          return null;
        }

        const { unitTitle, unitSlug } = firstPathway;

        const pathwaysByExamboard = Object.values(
          groupBy(pathways, "examboard"),
        );

        return (
          <Flex $flexDirection={["column"]} $mt={48}>
            <Heading tag={"h4"} $mb={16}>
              <Flex $flexDirection={["row"]} $alignItems="baseline">
                <Span $font="body-3-bold" $color="grey6" $mr={4}>
                  UNIT{" "}
                </Span>
                <Span>{unitTitle}</Span>
              </Flex>
            </Heading>
            <Grid $rg={16} $cg={16}>
              {pathwaysByExamboard.map((pathways) => {
                const [firstPathway] = pathways;

                if (!firstPathway) {
                  return null;
                }

                return (
                  <GridArea $colSpan={[12, 6, 4]}>
                    <LessonPathwayCard
                      {...firstPathway}
                      tiers={pathways}
                      unitSlug={unitSlug}
                    />
                  </GridArea>
                );
              })}
            </Grid>
          </Flex>
        );
      })}
    </Flex>
  );
}
