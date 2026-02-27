"use client";

import {
  OakBox,
  OakFlex,
  OakSmallTertiaryInvertedButton,
} from "@oaknational/oak-components";
import { useState } from "react";

import { useEyfsLessonGroupContext } from "../EyfsLessonGroupProvider";

import { EYFSLesson } from "@/node-lib/curriculum-api-2023/queries/eyfs/eyfsSchema";
import useLessonDownloadExistenceCheck from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useLessonDownloadExistenceCheck";
import { ResourcesToDownloadArrayType } from "@/components/TeacherComponents/types/downloadAndShare.types";
import LoginRequiredButton from "@/components/TeacherComponents/LoginRequiredButton/LoginRequiredButton";
import downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";

interface EYFSLessonCardProps {
  lesson: EYFSLesson;
}

export const EYFSLessonCard = ({ lesson }: EYFSLessonCardProps) => {
  const { activeVideoSlug, toggleVideo } = useEyfsLessonGroupContext();
  const isActiveVideo = activeVideoSlug === lesson.slug;

  const [activeResources, setActiveResources] =
    useState<ResourcesToDownloadArrayType>([]);

  useLessonDownloadExistenceCheck({
    lessonSlug: lesson.slug,
    resourcesToCheck: lesson.downloadableResources,
    additionalFilesIdsToCheck: null,
    onComplete: (resources) => setActiveResources(resources),
    isLegacyDownload: true,
  });

  const onDownload = async () => {
    await downloadLessonResources({
      lessonSlug: lesson.slug,
      selectedResourceTypes: activeResources,
      selectedAdditionalFilesIds: [],
      isLegacyDownload: true,
    });
  };

  return (
    <OakFlex $flexDirection="row" $flexWrap="nowrap" as="article">
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
        {lesson.orderInUnit}
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
            <LoginRequiredButton
              buttonVariant="tertiary"
              sizeVariant="small"
              geoRestricted={false}
              loginRequired
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
        {isActiveVideo && (
          <OakBox
            $pb="spacing-20"
            $pl={["spacing-8", "spacing-8", "spacing-0"]}
            data-testid="video"
          >
            <OakBox
              $aspectRatio="16/9"
              $background="bg-neutral"
              $width="100%"
              $minHeight="spacing-360"
            />
          </OakBox>
        )}
      </OakFlex>
    </OakFlex>
  );
};
