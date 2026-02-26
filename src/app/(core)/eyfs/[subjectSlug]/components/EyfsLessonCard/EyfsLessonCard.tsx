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

  return (
    <OakFlex $flexDirection="row">
      <OakFlex
        $background="bg-decorative4-main"
        $alignItems="center"
        $justifyContent="center"
        $minWidth="spacing-64"
        $bblr="border-radius-s"
        $btlr="border-radius-s"
        $font="heading-5"
      >
        {lesson.orderInUnit}
      </OakFlex>
      <OakFlex
        $background="bg-primary"
        $flexGrow={1}
        $flexDirection="column"
        $ph="spacing-20"
      >
        <OakFlex
          as="article"
          $minHeight="spacing-80"
          $alignItems="center"
          $gap="spacing-24"
          $flexGrow={1}
        >
          <OakFlex as="h2" $flexGrow={1} $font="heading-7" $textWrap="balance">
            {lesson.title}
          </OakFlex>
          {isSignedIn ? (
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
          )}
          <OakSmallTertiaryInvertedButton
            iconName="chevron-down"
            isTrailingIcon
            onClick={() => toggleVideo(lesson.slug)}
            $textWrap="nowrap"
          >
            {isActiveVideo ? "Hide video" : "Show video"}
          </OakSmallTertiaryInvertedButton>
        </OakFlex>
        {isActiveVideo && (
          <OakBox $mt="spacing-16">
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
