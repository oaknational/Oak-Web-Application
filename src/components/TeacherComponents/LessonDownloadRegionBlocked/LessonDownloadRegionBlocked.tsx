import {
  OakFlex,
  OakHeading,
  OakBox,
  OakP,
  OakLink,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import { useEffect } from "react";

import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { COPYRIGHT_CONTACT_US_LINK } from "@/utils/copyrightLinks";

interface LessonDownloadRegionBlockedProps {
  href: string;
}

export function LessonDownloadRegionBlocked({
  href,
}: Readonly<LessonDownloadRegionBlockedProps>) {
  const { contentBlockNotificationDisplayed } = useTeacherBrowseAnalytics(
    (store) => store.track,
  );
  useEffect(() => {
    contentBlockNotificationDisplayed({
      componentType: "lesson_downloads",
      accessBlockType: "Geo-restriction",
    });
  }, [contentBlockNotificationDisplayed]);
  return (
    <OakFlex
      $flexDirection={"column"}
      $color={"text-primary"}
      $mt={"spacing-24"}
      $gap={"spacing-24"}
      $maxWidth={"spacing-640"}
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
      <OakBox $pv={"spacing-40"}>
        <OakPrimaryButton href={href} element="a" iconName="arrow-left">
          Back to lesson{" "}
        </OakPrimaryButton>
      </OakBox>
    </OakFlex>
  );
}
