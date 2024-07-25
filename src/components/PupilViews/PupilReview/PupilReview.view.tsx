import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHandDrawnCard,
  OakHeading,
  OakImage,
  OakLessonBottomNav,
  OakLessonLayout,
  OakLessonReviewItem,
  OakPrimaryButton,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import { useLessonReviewFeedback } from "./useLessonReviewFeedback";

import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { useGetSectionLinkProps } from "@/components/PupilComponents/pupilUtils/lessonNavigation";

type PupilViewsReviewProps = {
  lessonTitle: string;
  backUrl?: string | null;
  phase?: "primary" | "secondary";
};

export const PupilViewsReview = (props: PupilViewsReviewProps) => {
  const { lessonTitle, backUrl, phase = "primary" } = props;
  const {
    updateCurrentSection,
    sectionResults,
    isLessonComplete,
    lessonReviewSections,
  } = useLessonEngineContext();
  const getSectionLinkProps = useGetSectionLinkProps();

  const { finalFeedback } = useLessonReviewFeedback(
    isLessonComplete,
    sectionResults,
  );

  const bottomNavSlot = (
    <OakLessonBottomNav>
      <OakPrimaryButton
        element="a"
        href={backUrl || undefined}
        iconName="arrow-right"
        isTrailingIcon
        width={["100%", "max-content"]}
      >
        View all lessons
      </OakPrimaryButton>
    </OakLessonBottomNav>
  );

  return (
    <OakLessonLayout
      bottomNavSlot={bottomNavSlot}
      lessonSectionName={"review"}
      phase={phase}
      topNavSlot={null}
    >
      <OakGrid
        $maxWidth={["100%", "all-spacing-23", "100%"]}
        $mt="space-between-m"
        $mb={["space-between-none", "space-between-s"]}
        $mh="auto"
        $ph={["inner-padding-m", "inner-padding-xl", "inner-padding-none"]}
      >
        <OakGridArea $colStart={[1, 1, 2]} $colSpan={[12, 12, 10]}>
          <OakTertiaryButton
            iconName="arrow-left"
            element="a"
            {...getSectionLinkProps("overview", updateCurrentSection)}
          >
            Lesson overview
          </OakTertiaryButton>

          <OakFlex $mv="space-between-xl">
            <OakFlex
              $flexDirection={"column"}
              $flexGrow={2}
              $gap={"space-between-l"}
              $justifyContent={"center"}
            >
              <OakHeading tag="h1" $font={["heading-4", "heading-3"]}>
                Lesson review
              </OakHeading>
              <OakHeading tag="h2" $font={"heading-light-7"}>
                {lessonTitle}
              </OakHeading>
            </OakFlex>

            <OakFlex $flexGrow={1}>
              <OakImage
                $display={["none", "none", "block"]}
                $height={"all-spacing-19"}
                alt="a man standing in front of a blackboard with a bunch of objects on top of his head and hands in the air"
                src={`https://${process.env.NEXT_PUBLIC_OAK_ASSETS_HOST}/${process.env.NEXT_PUBLIC_OAK_ASSETS_PATH}/v1699887218/svg-illustrations/xrazqgtjmbdf1clz8wic`}
              />
            </OakFlex>
          </OakFlex>
          <OakFlex
            $flexDirection={"column"}
            $alignItems={"stretch"}
            $gap={"space-between-s"}
            $mb="space-between-xl"
          >
            {lessonReviewSections.map((lessonSection) => {
              return (
                <OakLessonReviewItem
                  key={lessonSection}
                  lessonSectionName={lessonSection}
                  completed={!!sectionResults[lessonSection]?.isComplete}
                  grade={sectionResults[lessonSection]?.grade ?? 0}
                  numQuestions={
                    sectionResults[lessonSection]?.numQuestions ?? 0
                  }
                />
              );
            })}
          </OakFlex>
          <OakFlex
            $flexGrow={1}
            $flexDirection={["row", "column"]}
            $alignItems={["center", "flex-end"]}
          >
            <OakHandDrawnCard
              $pv={"inner-padding-xl"}
              $ph={"inner-padding-xl"}
              $alignItems={"center"}
            >
              <OakFlex
                $font="heading-5"
                $textAlign={["center", "left", "left"]}
              >
                {finalFeedback}
              </OakFlex>
            </OakHandDrawnCard>
          </OakFlex>
        </OakGridArea>
      </OakGrid>
    </OakLessonLayout>
  );
};
