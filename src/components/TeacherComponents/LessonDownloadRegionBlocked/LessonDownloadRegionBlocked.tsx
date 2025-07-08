import {
  OakFlex,
  OakHeading,
  OakBox,
  OakP,
  OakLink,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import { useEffect } from "react";

import useAnalytics from "@/context/Analytics/useAnalytics";
import { COPYRIGHT_CONTACT_US_LINK } from "@/utils/copyrightContactUsLink";

interface LessonDownloadRegionBlockedProps {
  lessonName: string;
  lessonSlug: string;
  lessonReleaseDate: string;
  href: string;
  isLegacy: boolean;
}

export function LessonDownloadRegionBlocked({
  lessonName,
  lessonSlug,
  lessonReleaseDate,
  href,
  isLegacy,
}: LessonDownloadRegionBlockedProps) {
  const { track } = useAnalytics();
  useEffect(() => {
    track.contentBlockNotificationDisplayed({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "explore",
      componentType: "lesson_downloads",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      lessonName: lessonName ?? null,
      lessonSlug: lessonSlug ?? null,
      lessonReleaseCohort: isLegacy ? "2020-2023" : "2023-2026",
      lessonReleaseDate: lessonReleaseDate ?? null,
      unitName: null,
      unitSlug: null,
      contentType: "lesson",
      accessBlockType: "Geo-restriction",
      accessBlockDetails: {},
    });
  }, [track, lessonName, lessonSlug, lessonReleaseDate, isLegacy]);
  return (
    <OakFlex
      $flexDirection={"column"}
      $color={"text-primary"}
      $mt={"space-between-m"}
      $gap={"space-between-m"}
      $maxWidth={"all-spacing-22"}
    >
      <OakHeading $font={"heading-4"} tag="h1">
        Sorry, downloads for this lesson are only available in the UK
      </OakHeading>
      <OakBox $font={"body-1"}>
        <OakP>
          Some of our content is restricted to the UK due to copyright.
        </OakP>
        <OakP>
          If you believe this is an error and you're based in the UK, please{" "}
          <OakLink href={COPYRIGHT_CONTACT_US_LINK}>contact us.</OakLink>
        </OakP>
      </OakBox>
      <OakBox $pv={"inner-padding-xl3"}>
        <OakPrimaryButton href={href} element="a" iconName="arrow-left">
          Back to lesson{" "}
        </OakPrimaryButton>
      </OakBox>
    </OakFlex>
  );
}
