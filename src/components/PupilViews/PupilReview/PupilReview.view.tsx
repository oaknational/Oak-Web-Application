import {
  OakFlex,
  OakHandDrawnCard,
  OakHeading,
  OakImage,
  OakLessonBottomNav,
  OakLessonLayout,
  OakLessonReviewItem,
  OakPrimaryButton,
  OakSpan,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import {
  lessonReviewSections,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";

type PupilViewsReviewProps = {
  lessonTitle: string;
};

export const PupilViewsReview = (props: PupilViewsReviewProps) => {
  const { lessonTitle } = props;
  const { updateCurrentSection, sectionResults, completedSections } =
    useLessonEngineContext();

  const bottomNavSlot = (
    <OakLessonBottomNav>
      <OakPrimaryButton
        type="button"
        width={["100%", "auto"]}
        onClick={() => {
          updateCurrentSection("overview");
        }}
      >
        Lesson overview
      </OakPrimaryButton>
    </OakLessonBottomNav>
  );

  return (
    <OakLessonLayout
      bottomNavSlot={bottomNavSlot}
      lessonSectionName={"review"}
      topNavSlot={null}
    >
      <OakFlex
        $flexDirection={"column"}
        $alignItems={"stretch"}
        $pa={"inner-padding-xl"}
        $gap={"space-between-xl"}
      >
        <OakTertiaryButton
          iconName="arrow-left"
          $pa={"inner-padding-m"}
          disabled
        >
          View all lessons
        </OakTertiaryButton>
        <OakFlex>
          <OakFlex
            $flexDirection={"column"}
            $flexGrow={2}
            $gap={"space-between-l"}
            $justifyContent={"center"}
          >
            <OakHeading tag="h1" $font={"heading-3"}>
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
              src="https://res.cloudinary.com/oak-web-application/image/upload/v1699887218/svg-illustrations/xrazqgtjmbdf1clz8wic"
            />
          </OakFlex>
        </OakFlex>
        <OakFlex
          $flexDirection={"column"}
          $alignItems={"stretch"}
          $gap={"space-between-s"}
        >
          {lessonReviewSections.map((lessonSection) => {
            return (
              <OakLessonReviewItem
                lessonSectionName={lessonSection}
                completed={completedSections.includes(lessonSection)}
                grade={sectionResults[lessonSection]?.grade ?? 0}
                numQuestions={sectionResults[lessonSection]?.numQuestions ?? 0}
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
            <OakSpan $font="heading-5">Fantastic learning - well done!</OakSpan>
          </OakHandDrawnCard>
        </OakFlex>
      </OakFlex>
    </OakLessonLayout>
  );
};
