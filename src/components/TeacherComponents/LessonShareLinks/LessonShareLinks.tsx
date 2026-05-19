import { FC, useEffect, useState } from "react";
import { OakFlex, OakSecondaryButton } from "@oaknational/oak-components";
import { useFeatureFlagEnabled } from "posthog-js/react";

import { SharePageNumberedHeading } from "../SharePageNumberedHeading/SharePageNumberedHeading";

import { shareLinkConfig } from "./linkConfig";
import { getHrefForSocialSharing } from "./getHrefForSocialSharing";

import { ResourceType } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { ShareMediumValueType } from "@/browser-lib/avo/Avo";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";
import { getLessonShareVariantSlug } from "@/pages-helpers/pupil";

const copyToClipboard = (textToCopy: string, callback: () => boolean) => {
  const isValid = callback();
  if (isValid) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
    } else {
      alert("Please update your browser to support this feature");
    }
  } else {
    return;
  }
};

const LessonShareLinks: FC<{
  hasError?: boolean;
  shareLink: string;
  disabled: boolean;
  lessonSlug: string;
  selectedActivities?: Array<ResourceType>;
  schoolUrn?: string;
  onSubmit: (shareMedium: ShareMediumValueType) => boolean;
  onGoogleClassroomClick?: () => void;
}> = (props) => {
  const lessonShareVariantSlug =
    getLessonShareVariantSlug(
      props.selectedActivities as (
        | "video"
        | "intro"
        | "overview"
        | "starter-quiz"
        | "exit-quiz"
        | "review"
      )[],
    ) || "";
  const [isShareSuccessful, setIsShareSuccessful] = useState(false);
  const { setCurrentToastProps } = useOakNotificationsContext();
  const useGoogleClassroomAddon = useFeatureFlagEnabled(
    "google-classroom-free-tier",
  );

  useEffect(() => {
    setIsShareSuccessful(false);
  }, [props.selectedActivities]);

  const linkShareOptions = [
    shareLinkConfig.microsoftTeams,
    // shareLinkConfig.email,
    ...(props.onGoogleClassroomClick && useGoogleClassroomAddon
      ? []
      : [shareLinkConfig.googleClassroom]),
  ];

  return (
    <OakFlex
      $background={"bg-decorative5-main"}
      $width={"100%"}
      $borderRadius={"border-radius-l"}
      $pa={"spacing-24"}
      $flexDirection={"column"}
      $gap={"spacing-20"}
    >
      <SharePageNumberedHeading
        number={2}
        title={"Share with pupils"}
        paragraph={
          "Use one of the links below to share the selected activities with your pupils."
        }
      />
      <OakFlex $flexWrap={"wrap"} $width={"100%"} $gap={"spacing-12"}>
        <OakSecondaryButton
          element="button"
          iconName={shareLinkConfig.copy.icon}
          isTrailingIcon={true}
          onClick={() => {
            copyToClipboard(
              getHrefForSocialSharing({
                lessonSlug: props.lessonSlug,
                selectedActivities: props.selectedActivities,
                schoolUrn: props.schoolUrn,
                linkConfig: shareLinkConfig.copy,
                shareVariant: lessonShareVariantSlug,
              }),
              () => {
                const isValid = props.onSubmit("copy-link");
                if (isValid) {
                  setIsShareSuccessful(true);
                  setCurrentToastProps({
                    message: "Link copied to clipboard",
                    variant: "green",
                    autoDismiss: true,
                    showIcon: true,
                  });
                }
                return isValid;
              },
            );
          }}
          aria-label="Copy link to clipboard"
        >
          {isShareSuccessful
            ? "Link copied to clipboard"
            : shareLinkConfig.copy.name}
        </OakSecondaryButton>

        {props.onGoogleClassroomClick && useGoogleClassroomAddon && (
          <OakSecondaryButton
            iconName={shareLinkConfig.googleClassroom.icon}
            isTrailingIcon={true}
            onClick={() => {
              props.onSubmit(shareLinkConfig.googleClassroom.avoMedium);
              props.onGoogleClassroomClick!();
            }}
            disabled={props.disabled}
            aria-label="Assign to Google Classroom"
          >
            {shareLinkConfig.googleClassroom.name}
          </OakSecondaryButton>
        )}

        {linkShareOptions.map((link, index) => (
          <OakSecondaryButton
            element="a"
            iconName={link.icon}
            isTrailingIcon={true}
            onClick={() => {
              props.onSubmit(link.avoMedium);
            }}
            aria-label={`Share to ${link.name}`}
            href={getHrefForSocialSharing({
              lessonSlug: props.lessonSlug,
              selectedActivities: props.selectedActivities,
              schoolUrn: props.schoolUrn,
              linkConfig: link,
              shareVariant: lessonShareVariantSlug,
            })}
            target="_blank"
            key={index}
          >
            {link.name}
          </OakSecondaryButton>
        ))}
      </OakFlex>
    </OakFlex>
  );
};

export default LessonShareLinks;
