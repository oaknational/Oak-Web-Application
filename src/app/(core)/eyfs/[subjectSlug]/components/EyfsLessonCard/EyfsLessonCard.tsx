import {
  OakBox,
  OakFlex,
  OakSmallTertiaryInvertedButton,
} from "@oaknational/oak-components";
import { SignUpButton } from "@clerk/nextjs";

import { useEyfsLessonGroupContext } from "../EyfsLessonGroupProvider";

import { EYFSLesson } from "@/node-lib/curriculum-api-2023/queries/eyfs/eyfsSchema";

interface EyfsLessonCardProps {
  lesson: EYFSLesson;
  isSignedIn: boolean;
}

export const EyfsLessonCard = ({ lesson, isSignedIn }: EyfsLessonCardProps) => {
  const { activeVideoSlug, toggleVideo } = useEyfsLessonGroupContext();
  const isActiveVideo = activeVideoSlug === lesson.slug;
  const downloadButton = isSignedIn ? (
    <OakSmallTertiaryInvertedButton
      iconName="download"
      isTrailingIcon
      $textWrap="nowrap"
    >
      Download lesson
    </OakSmallTertiaryInvertedButton>
  ) : (
    <SignUpButton>
      <OakSmallTertiaryInvertedButton
        iconName="download"
        isTrailingIcon
        $textWrap="nowrap"
      >
        Sign in to download
      </OakSmallTertiaryInvertedButton>
    </SignUpButton>
  );

  const toggleVideoButton = (
    <OakSmallTertiaryInvertedButton
      iconName="chevron-down"
      isTrailingIcon
      onClick={() => toggleVideo(lesson.slug)}
      $textWrap="nowrap"
    >
      {isActiveVideo ? "Hide video" : "Show video"}
    </OakSmallTertiaryInvertedButton>
  );

  return (
    <OakFlex $flexDirection="row" $flexWrap="nowrap" as="article">
      {/* Order badge - left column, full height on desktop (per design) */}
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

      {/* Content area - title, buttons, video */}
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
        {/* Article: title + buttons - order|title same row on mobile (order is sibling above) */}
        <OakFlex
          $flexDirection="row"
          $flexWrap="wrap"
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
          <OakFlex $flexBasis={["100%", "100%", "auto"]}>
            {downloadButton}
          </OakFlex>
          <OakFlex
            $flexBasis={["100%", "100%", "auto"]}
            $justifyContent={["flex-end", "flex-end", null]}
          >
            {toggleVideoButton}
          </OakFlex>
        </OakFlex>
        {isActiveVideo && (
          <OakBox
            $pb="spacing-20"
            $pl={["spacing-8", "spacing-8", "spacing-0"]}
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
