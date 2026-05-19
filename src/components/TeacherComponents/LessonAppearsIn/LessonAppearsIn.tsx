import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakSpan,
  OakFlex,
} from "@oaknational/oak-components";

import { LessonAppearsInPathwayCard } from "@/components/TeacherComponents/LessonAppearsInPathwayCard";
import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import { TagColor } from "@/components/SharedComponents/TagFunctional/TagFunctional";

type LessonAppearsInProps = {
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

export function LessonAppearsIn(props: Readonly<LessonAppearsInProps>) {
  const { subjects } = props;

  return (
    <OakFlex $flexDirection={["column"]}>
      <OakHeading $font={"heading-5"} tag={"h2"}>
        Lesson appears in
      </OakHeading>
      {subjects.map(({ subjectTitle, subjectSlug, units }) => {
        return units.map(({ unitTitle, unitSlug, examBoards }) => {
          return (
            <OakFlex
              key={`LessonAppearsIn-s-${subjectSlug}-u-${unitSlug}`}
              $flexDirection={["column"]}
              $mt="spacing-48"
            >
              <OakHeading tag={"h3"} $mb="spacing-16">
                <OakFlex $flexDirection={["row"]} $alignItems="baseline">
                  <TagFunctional text="Unit" color="grey" $mr="spacing-12" />
                  <OakSpan $font="heading-light-6">
                    {subjectTitle} / {unitTitle}
                  </OakSpan>
                </OakFlex>
              </OakHeading>
              <OakGrid $rg={"spacing-16"} $cg={"spacing-16"}>
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
                        headingTag={"h3"}
                        examBoardTagColor={tagColor}
                      />
                    </OakGridArea>
                  );
                })}
              </OakGrid>
            </OakFlex>
          );
        });
      })}
    </OakFlex>
  );
}
