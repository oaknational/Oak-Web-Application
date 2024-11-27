import {
  OakTertiaryButton,
  OakBox,
  OakMaxWidth,
  OakP,
  OakFlex,
  OakMediaClipList,
} from "@oaknational/oak-components";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";
import { useSignedThumbnailToken } from "@/components/SharedComponents/VideoPlayer/useSignedVideoToken";

import { resolveOakHref } from "@/common-lib/urls";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs";
import {
  getLessonOverviewBreadCrumb,
  getBreadcrumbsForLessonPathway,
  getCommonPathway,
  getLessonMediaBreadCrumb,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import { LessonPathway } from "@/components/TeacherComponents/types/lesson.types";
import { LessonMediaClipInfo } from "@/components/TeacherComponents/LessonMediaClipInfo";

type BaseLessonMedia = {
  lessonTitle: string;
  lessonSlug: string;
  keyStageTitle: string;
  subjectTitle: string;
  yearTitle: string;
};

type CanonicalLesson = BaseLessonMedia & {
  pathways: LessonPathway[];
};

type NonCanonicalLesson = BaseLessonMedia & LessonPathway;

type LessonMediaProps =
  | {
      isCanonical: true;
      lesson: CanonicalLesson;
    }
  | {
      isCanonical: false;
      lesson: NonCanonicalLesson;
    };

export function LessonMedia(props: LessonMediaProps) {
  const { isCanonical, lesson } = props;
  const { lessonTitle, lessonSlug, keyStageTitle, subjectTitle, yearTitle, mediaClips } = lesson;

  const commonPathway = getCommonPathway(
    props.isCanonical ? props.lesson.pathways : [props.lesson],
  );

  const { programmeSlug, unitSlug } = commonPathway;

  const listOfAllClips = [];

  Object.keys(mediaClips).forEach(learningCycle => {
    mediaClips[learningCycle].forEach((mediaClip) => {
      let item;
      if (mediaClip.mediaType === "video") {
        const { videoObject } = mediaClip;

        const thumbnailToken = useSignedThumbnailToken({
          playbackId: videoObject.muxPlaybackId,
          playbackPolicy: "signed",
          isLegacy: false,
        });

        item = ({
          thumbnailImage: `https://image.mux.com/${videoObject.muxPlaybackId}/thumbnail.{format}?token=${thumbnailToken}`,
          muxPlaybackId: videoObject.muxPlaybackId,
          timeCode: videoObject.duration,
          clipName: videoObject.displayName,
          learningCycle: "learning cycle title here",
          muxPlayingState: "standard",
          onClick: () => {},
          imageAltText: "",
          isAudioClip: false,
          element: "button",
        })
      } else if (mediaClip.mediaType === "audio") {
        const { mediaObject } = mediaClip;
  
        item = ({
          muxPlaybackId: mediaObject.muxPlaybackId,
          timeCode: mediaObject.duration,
          clipName: mediaObject.displayName,
          learningCycle: "learning cycle title here",
          muxPlayingState: "standard",
          onClick: () => {},
          imageAltText: "",
          isAudioClip: true,
          element: "button",
        })
      }
      listOfAllClips.push(item);
    });  


  });

  console.log("listOfAllClips", listOfAllClips)

  return (
    <OakMaxWidth $pb={"inner-padding-xl8"} $ph={"inner-padding-s"}>
      <OakBox $mb={"space-between-m2"} $mt={"space-between-m"}>
        <Breadcrumbs
          breadcrumbs={[
            ...getBreadcrumbsForLessonPathway(commonPathway),
            getLessonOverviewBreadCrumb({
              lessonTitle,
              lessonSlug,
              programmeSlug,
              unitSlug,
              isCanonical,
            }),
            getLessonMediaBreadCrumb({
              lessonSlug,
              programmeSlug,
              unitSlug,
              disabled: true,
            }),
          ]}
        />
      </OakBox>
      <OakBox $mb={"space-between-m"}>
        {programmeSlug && unitSlug && (
          <OakTertiaryButton
            element="a"
            href={resolveOakHref({
              page: "lesson-overview",
              programmeSlug,
              lessonSlug,
              unitSlug,
            })}
            iconName="arrow-left"
            data-testid="back-to-lesson-button"
          >
            Back to lesson
          </OakTertiaryButton>
        )}
        {isCanonical && (
          <OakTertiaryButton
            element="a"
            href={resolveOakHref({
              page: "lesson-overview-canonical",
              lessonSlug,
            })}
            iconName="arrow-left"
            data-testid="back-to-lesson-button"
          >
            Back to lesson
          </OakTertiaryButton>
        )}
      </OakBox>

      <OakFlex $flexDirection={"column"} $gap={"space-between-m2"}>
        <VideoPlayer
          playbackId={listOfAllClips[0].muxPlaybackId}
          playbackPolicy={"signed"}
          title={""}
          location={"lesson"}
          isLegacy={false}
        />

        <LessonMediaClipInfo
          clipTitle="Clip title"
          keyStageTitle={keyStageTitle}
          yearTitle={yearTitle}
          subjectTitle={subjectTitle}
          videoTranscript={<OakP>video transcript here</OakP>}
          copyLinkButtonEnabled={true}
          copyLinkHref="/hey"
        />

        <OakMediaClipList 
          lessonTitle={lessonTitle}
          mediaClipList={listOfAllClips}
        />
      
      </OakFlex>
    </OakMaxWidth>
  );
}
