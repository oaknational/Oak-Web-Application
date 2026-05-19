import { FC, useEffect, useState } from "react";
import { OakFlex, OakSecondaryButton } from "@oaknational/oak-components";
import { useFeatureFlagEnabled } from "posthog-js/react";

import { SharePageNumberedHeading } from "../SharePageNumberedHeading/SharePageNumberedHeading";

import { ShareLinkConfig, shareLinkConfig } from "./linkConfig";
import { getHrefForSocialSharing } from "./getHrefForSocialSharing";

import { ShareMediumValueType } from "@/browser-lib/avo/Avo";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";
import { getLessonShareVariantSlug } from "@/pages-helpers/pupil";
import { LessonSection } from "@/components/PupilComponents/lessonSections";

const LessonShareLinks: FC<{
  disabled: boolean;
  lessonSlug: string;
  selectedActivities: LessonSection[];
  schoolUrn?: string;
  onSubmit: (shareMedium: ShareMediumValueType) => boolean;
  onGoogleClassroomClick?: () => void;
}> = (props) => {
  const lessonShareVariantSlug =
    getLessonShareVariantSlug(props.selectedActivities) || "";
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
    ...(props.onGoogleClassroomClick && useGoogleClassroomAddon
      ? []
      : [shareLinkConfig.googleClassroom]),
  ];

  const onShareClick = (link: ShareLinkConfig) => {
    const isValid = props.onSubmit(link.avoMedium);
    const href = getHrefForSocialSharing({
      lessonSlug: props.lessonSlug,
      selectedActivities: props.selectedActivities,
      schoolUrn: props.schoolUrn,
      linkConfig: link,
      shareVariant: lessonShareVariantSlug,
    });
    if (isValid) {
      globalThis.open(href, "_blank", "noopener,noreferrer");
    }
  };

  const OnCopyToClipboardClick = () => {
    const isValid = props.onSubmit("copy-link");
    if (isValid) {
      if (navigator.clipboard) {
        const textToCopy = getHrefForSocialSharing({
          lessonSlug: props.lessonSlug,
          selectedActivities: props.selectedActivities,
          schoolUrn: props.schoolUrn,
          linkConfig: shareLinkConfig.copy,
          shareVariant: lessonShareVariantSlug,
        });
        navigator.clipboard.writeText(textToCopy);
        setIsShareSuccessful(true);
        setCurrentToastProps({
          message: "Link copied to clipboard",
          variant: "green",
          autoDismiss: true,
          showIcon: true,
        });
      } else {
        alert("Please update your browser to support this feature");
      }
    } else {
      return;
    }
  };

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
          onClick={OnCopyToClipboardClick}
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

        {linkShareOptions.map((link) => (
          <OakSecondaryButton
            element="button"
            iconName={link.icon}
            isTrailingIcon={true}
            onClick={() => onShareClick(link)}
            aria-label={`Share to ${link.name}`}
            key={link.name}
          >
            {link.name}
          </OakSecondaryButton>
        ))}
      </OakFlex>
    </OakFlex>
  );
};

export default LessonShareLinks;
