import {
  OakFlex,
  OakAnchorTarget,
  OakHeading,
  OakSecondaryButton,
  OakBox,
  OakHandDrawnHR,
} from "@oaknational/oak-components";
import { useState } from "react";

import { LessonResource } from "./getLessonResources";

import {
  getPreselectedDownloadFromTitle,
  getContainerId,
} from "@/components/TeacherComponents/LessonItemContainer/LessonItemContainer";
import { LessonItemContainerLink } from "@/components/TeacherComponents/LessonItemContainerLink";
import LessonPlayAllButton from "@/components/TeacherComponents/LessonPlayAllButton";
import { DownloadableLessonTitles } from "@/components/TeacherComponents/types/downloadAndShare.types";

export function LessonItem({
  resource,
  slugs,
}: Readonly<{
  resource: LessonResource;
  slugs: {
    lessonSlug: string;
    unitSlug: string | null;
    programmeSlug: string | null;
  };
}>) {
  const [skipResourceButtonFocused, setSkipResourceButtonFocused] =
    useState(false);
  const { title } = resource;
  const preselectedDownload = getPreselectedDownloadFromTitle(
    title as DownloadableLessonTitles,
  );
  // const preselectedShare = getPreselectedQueryFromTitle(
  //   title as DownloadableLessonTitles,
  // );

  const downloadTitle = resource.downloadTitle
    ? resource.downloadTitle
    : title.toLowerCase();
  return (
    <OakFlex
      $flexDirection="column"
      $position={"relative"}
      id={getContainerId(title)}
      tabIndex={-1}
    >
      <OakAnchorTarget id={resource.key} $pt={"spacing-24"} />
      <OakFlex
        $mb={
          resource.skipLinkUrl
            ? ["spacing-12", "spacing-24", "spacing-24"]
            : ["spacing-24"]
        }
        $position={"relative"}
        $flexDirection={"column"}
        $gap={"spacing-12"}
      >
        <OakFlex
          $flexDirection={["column", "row"]}
          $alignItems={["start", "end"]}
          $gap={["spacing-12", "spacing-40"]}
          $height={["auto", "spacing-40"]}
        >
          {title && (
            <OakHeading $font={["heading-5", "heading-4"]} tag={"h2"}>
              {title}
            </OakHeading>
          )}
          {resource.key === "media-clips" && slugs && (
            <LessonPlayAllButton {...slugs} />
          )}
          {resource.downloadable && slugs && (
            <LessonItemContainerLink
              page={"download"}
              resourceTitle={downloadTitle}
              onClick={() => {}}
              preselected={preselectedDownload}
              isSpecialist={false}
              {...slugs}
            />
          )}
          {/* {shareable && slugs && (
            <LessonItemContainerLink
              page={"share"}
              resourceTitle={downloadTitle}
              onClick={onDownloadButtonClick}
              preselected={preselectedShare}
              isSpecialist={props.isSpecialist}
              {...slugs}
            />
          )} */}

          {resource.skipLinkUrl && (
            <OakSecondaryButton
              element="a"
              href={resource.skipLinkUrl}
              onFocus={() => setSkipResourceButtonFocused(true)}
              onBlur={() => setSkipResourceButtonFocused(false)}
              style={
                skipResourceButtonFocused
                  ? {}
                  : {
                      position: "absolute",
                      left: "-1000px",
                      opacity: 0,
                    }
              }
            >
              {`Skip ${downloadTitle}`}
            </OakSecondaryButton>
          )}
        </OakFlex>
      </OakFlex>

      <OakBox>{resource.component}</OakBox>
      {!resource.isFinalElement && (
        <OakHandDrawnHR
          data-testid="hr"
          hrColor={"bg-decorative4-main"}
          $height={"spacing-4"}
          $mt={["spacing-24", "spacing-56"]}
          $mb={["spacing-12", "spacing-24"]}
        />
      )}
    </OakFlex>
  );
}
