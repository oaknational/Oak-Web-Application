import {
  OakTertiaryButton,
  OakBox,
  OakMaxWidth,
  OakFlex,
  OakMediaClipList,
} from "@oaknational/oak-components";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { cloneDeep } from "lodash";

import VideoPlayer from "@/components/SharedComponents/VideoPlayer";
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
import type {
  MediaClipsList,
  ConstructedMediaClip,
} from "@/components/TeacherComponents/types/mediaClip.types";
import { constructMediaClipList } from "@/components/TeacherComponents/helpers/lessonHelpers/mediaClips.helpers";

type BaseLessonMedia = {
  lessonTitle: string;
  lessonSlug: string;
  keyStageTitle: string;
  mediaClips: MediaClipsList;
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

export const LessonMedia = (props: LessonMediaProps) => {
  const { isCanonical, lesson } = props;
  const { lessonTitle, lessonSlug, keyStageTitle, mediaClips } = lesson;

  const commonPathway = getCommonPathway(
    props.isCanonical ? props.lesson.pathways : [props.lesson],
  );

  const { programmeSlug, unitSlug, subjectTitle, yearTitle } = commonPathway;

  const router = useRouter();
  const { query } = router;

  const onMediaClipClick = (clipSlug: string) => {
    const clickedMediaClip = clipList.find(
      (clip) => clip.clipSlug === clipSlug,
    );
    setCurrentClip(clickedMediaClip);
    setActiveClip();

    if (currentClip) setCurrentIndex(clipList.indexOf(currentClip));

    // add video parameter to the url
    router.replace(
      {
        pathname: router.pathname,
        query: {
          programmeSlug: programmeSlug,
          unitSlug: unitSlug,
          lessonSlug: lessonSlug,
          video: clipSlug,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  let listOfAllClips: ConstructedMediaClip[] = constructMediaClipList(mediaClips, onMediaClipClick);

  const getInitialCurrentClip = () => {
    const videoQueryFromUrl = query.video;
    if (videoQueryFromUrl) {
      return clipList.find((clip) => clip.clipSlug === videoQueryFromUrl);
    } else {
      return clipList[0];
    }
  };

  const setActiveClip = () => {
    setClipList((prevList) => {
      const newList = cloneDeep(prevList);
      if (newList[currentIndex]) {
        newList[currentIndex].muxPlayingState = "playing";
      }
      return newList;
    }); 
  };

  const [clipList, setClipList] = useState(listOfAllClips);
  const [currentClip, setCurrentClip] = useState(getInitialCurrentClip());
  const [currentIndex, setCurrentIndex] = useState(currentClip ? clipList.indexOf(currentClip) : 0);

  useEffect(() => {
    setActiveClip();
  }, [])

  const videoPlayer = currentClip && (
    <VideoPlayer
      playbackId={currentClip.muxPlaybackId}
      playbackPolicy={"signed"}
      title={currentClip.clipName}
      location={"lesson"}
      isLegacy={false}
    />
  );

  // media clip list component
  const mediaClipList = (
    <OakMediaClipList
      lessonTitle={lessonTitle}
      mediaClipList={clipList}
    />
  );

  // media clip info component
  const lessonMediaClipInfo = currentClip && yearTitle && subjectTitle && (
    <LessonMediaClipInfo
      clipTitle={currentClip.clipName}
      keyStageTitle={keyStageTitle}
      yearTitle={yearTitle}
      subjectTitle={subjectTitle}
      videoTranscript={currentClip?.transcript?.join(" ")}
      copyLinkButtonEnabled={true}
    />
  );

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

      {/* desktop layout */}
      {listOfAllClips.length > 0 && currentClip && (
        <OakBox $display={["none", "none", "block"]}>
          <OakFlex
            $flexDirection={"row"}
            $height={"all-spacing-21"}
            $mb={"space-between-m"}
          >
            <OakFlex
              $flexGrow={1}
              $alignItems={"center"}
              $background={"black"}
              $overflow={"hidden"}
            >
              {videoPlayer}
            </OakFlex>
            <OakFlex $maxWidth={"all-spacing-20"}>{mediaClipList}</OakFlex>
          </OakFlex>

          {lessonMediaClipInfo}
        </OakBox>
      )}

      {/* mobile layout */}
      {listOfAllClips.length > 0 && currentClip && (
        <OakBox $display={["block", "block", "none"]}>
          <OakFlex $flexDirection={"column"} $gap={"space-between-m"}>
            {videoPlayer}
            {lessonMediaClipInfo}
            {mediaClipList}
          </OakFlex>
        </OakBox>
      )}
    </OakMaxWidth>
  );
}
