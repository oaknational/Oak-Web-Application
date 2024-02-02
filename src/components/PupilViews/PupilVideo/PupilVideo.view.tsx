import {
  OakBackLink,
  OakGrid,
  OakGridArea,
  OakLessonBottomNav,
  OakLessonLayout,
  OakLessonTopNav,
  OakPrimaryButton,
} from "@oaknational/oak-components";

import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer/VideoPlayer";

export const PupilViewsVideo = () => {
  const { completeSection, updateCurrentSection } = useLessonEngineContext();

  return (
    <OakLessonLayout
      lessonSectionName="video"
      topNavSlot={
        <OakLessonTopNav
          backLinkSlot={
            <OakBackLink
              type="button"
              onClick={() => {
                updateCurrentSection("overview");
              }}
            />
          }
          heading="Lesson video"
          lessonSectionName="video"
          mobileSummary="In progress..."
        />
      }
      bottomNavSlot={
        <OakLessonBottomNav>
          <OakPrimaryButton
            onClick={() => {
              completeSection("video");
            }}
            width={["100%", "auto"]}
            iconName="arrow-right"
            isTrailingIcon
          >
            I've finished the video
          </OakPrimaryButton>
        </OakLessonBottomNav>
      }
    >
      <OakGrid>
        <OakGridArea $colStart={2} $colSpan={10}>
          <VideoPlayer
            playbackId={""}
            playbackPolicy="public"
            title={""}
            location={"webinar"}
            isLegacy={false}
          />
        </OakGridArea>
      </OakGrid>
    </OakLessonLayout>
  );
};
