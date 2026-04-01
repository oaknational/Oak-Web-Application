"use client";

import {
  OakBox,
  OakFlex,
  OakP,
  OakSmallTertiaryInvertedButton,
} from "@oaknational/oak-components";

import { useEyfsLessonGroupContext } from "../EyfsLessonGroupProvider";

import { useEyfsLessonDownload } from "./useEyfsLessonDownload";

import { EYFSLesson } from "@/node-lib/curriculum-api-2023/queries/eyfs/eyfsSchema";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";
import LoginRequiredButton from "@/components/TeacherComponents/LoginRequiredButton/LoginRequiredButton";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";

interface EYFSLessonCardProps {
  index: number;
  lesson: EYFSLesson;
  schoolName: string;
  schoolId: string;
}

export const EYFSLessonCard = ({
  lesson,
  index,
  schoolId,
  schoolName,
}: EYFSLessonCardProps) => {
  const { activeVideoSlug, toggleVideo } = useEyfsLessonGroupContext();
  const isActiveVideo = activeVideoSlug === lesson.slug;

  const { onDownload } = useEyfsLessonDownload({
    lessonSlug: lesson.slug,
    downloadableResources: lesson.downloadableResources,
    schoolId,
    schoolName,
  });

  return (
    <OakFlex
      $flexDirection="row"
      $flexWrap="nowrap"
      as="article"
      $position={"relative"}
    >
      <AnchorTarget id={`download-btn-${lesson.slug}`} />
      <OakFlex
        $flexShrink={0}
        $minWidth="spacing-64"
        $background="bg-decorative4-main"
        $alignItems="center"
        $justifyContent="center"
        $bblr="border-radius-s"
        $btlr="border-radius-s"
        $font="heading-5"
        $display={["none", "none", "flex"]}
      >
        {index}
      </OakFlex>
      <OakFlex
        $flexGrow={1}
        $minWidth={0}
        $flexDirection="column"
        $background="bg-primary"
        $pl={["spacing-12", "spacing-12", "spacing-20"]}
        $pr="spacing-20"
        $pv={["spacing-20", "spacing-20", "spacing-0"]}
        $gap={["spacing-16", "spacing-16", "spacing-0"]}
        $borderRadius="border-radius-s"
        $bblr={["border-radius-s", "border-radius-s", "border-radius-square"]}
        $btlr={["border-radius-s", "border-radius-s", "border-radius-square"]}
      >
        <OakFlex
          $flexDirection="row"
          $flexWrap={["wrap", "wrap", "nowrap"]}
          $alignItems={["stretch", "stretch", "center"]}
          $gap={["spacing-16", "spacing-16", "spacing-24"]}
          $minHeight={["auto", "auto", "spacing-80"]}
          $flexGrow={[0, 0, 1]}
        >
          <OakFlex
            as="h2"
            $flexGrow={1}
            $minWidth={0}
            $font="heading-7"
            $textWrap="balance"
            $alignItems={["flex-start", "flex-start", "center"]}
            $gap="spacing-16"
          >
            <OakFlex
              $flexShrink={0}
              $minWidth="spacing-40"
              $minHeight="spacing-40"
              $background="bg-decorative4-main"
              $alignItems="center"
              $justifyContent="center"
              $borderRadius="border-radius-s"
              $font="heading-6"
              $ml="spacing-8"
              $display={["flex", "flex", "none"]}
            >
              {lesson.orderInUnit}
            </OakFlex>

            {lesson.title}
          </OakFlex>
          <OakFlex $flexBasis={["100%", "100%", "auto"]} $flexShrink={0}>
            {lesson.downloadableResources.length > 0 && (
              <LoginRequiredButton
                buttonVariant="tertiary"
                sizeVariant="small"
                geoRestricted={false}
                loginRequired
                returnToAnchor={`download-btn-${lesson.slug}`}
                actionProps={{
                  name: "Download lesson",
                  isActionGeorestricted: false,
                  onClick: onDownload,
                }}
                signUpProps={{
                  name: "Sign in to download",
                }}
                onboardingProps={{
                  name: "Complete onboarding to download",
                }}
                iconName="download"
                isTrailingIcon
              />
            )}
          </OakFlex>
          {lesson.video.muxPlaybackId && (
            <OakFlex
              $flexBasis={["100%", "100%", "auto"]}
              $flexShrink={0}
              $justifyContent={["flex-end", "flex-end", null]}
            >
              <OakSmallTertiaryInvertedButton
                iconName={isActiveVideo ? "chevron-up" : "chevron-down"}
                isTrailingIcon
                onClick={() => toggleVideo(lesson.slug)}
                $textWrap="nowrap"
              >
                {isActiveVideo ? "Hide video" : "Show video"}
              </OakSmallTertiaryInvertedButton>
            </OakFlex>
          )}
        </OakFlex>
        {isActiveVideo && lesson.video.muxPlaybackId && (
          <OakBox
            $pb={["spacing-0", "spacing-0", "spacing-20"]}
            $pl={["spacing-8", "spacing-8", "spacing-0"]}
            data-testid="video"
          >
            <VideoPlayer
              playbackId={lesson.video.muxPlaybackId}
              playbackPolicy={"signed"}
              title={lesson.title}
              location={"lesson"}
              isLegacy={true}
              autoFocusPlayButton
            />
            <OakP $textWrap="balance" $mt="spacing-48" $textAlign="right">
              Some of our videos, including non-English language videos, do not
              have captions.
            </OakP>
          </OakBox>
        )}
      </OakFlex>
    </OakFlex>
  );
};
