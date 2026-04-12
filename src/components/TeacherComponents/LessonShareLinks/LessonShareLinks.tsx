import { FC, useEffect, useState } from "react";
import { OakHeading, OakFlex } from "@oaknational/oak-components";

import { shareLinkConfig } from "./linkConfig";
import { getHrefForSocialSharing } from "./getHrefForSocialSharing";

import { ResourceType } from "@/components/TeacherComponents/types/downloadAndShare.types";
import LoadingButton from "@/components/SharedComponents/Button/LoadingButton";
import { ShareMediumValueType } from "@/browser-lib/avo/Avo";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";

const copyToClipboard = (textToCopy: string, callback: () => void) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(textToCopy);
    callback();
  } else {
    alert("Please update your browser to support this feature");
  }
};

const LessonShareLinks: FC<{
  disabled: boolean;
  lessonSlug: string;
  selectedActivities?: Array<ResourceType>;
  schoolUrn?: string;
  onSubmit: (shareMedium: ShareMediumValueType) => void;
  /** When provided, clicking "Assign to Google Classroom" opens the CourseWork
   *  modal instead of navigating to the generic Classroom share URL. */
  onGoogleClassroomClick?: () => void;
}> = (props) => {
  const [isShareSuccessful, setIsShareSuccessful] = useState(false);
  const { setCurrentToastProps } = useOakNotificationsContext();

  useEffect(() => {
    setIsShareSuccessful(false);
  }, [props.selectedActivities]);

  const nonClassroomLinks = [
    shareLinkConfig.microsoftTeams,
    shareLinkConfig.email,
  ];

  return (
    <>
      <OakHeading
        $mt="spacing-24"
        $mb="spacing-4"
        tag={"h4"}
        $font={"heading-7"}
      >
        Share options:
      </OakHeading>
      <OakFlex $flexWrap={"wrap"} $width={"100%"} $gap={"spacing-12"}>
        <LoadingButton
          text={
            isShareSuccessful
              ? "Link copied to clipboard"
              : shareLinkConfig.copy.name
          }
          success={isShareSuccessful}
          type="button"
          ariaLabel="Copy link to clipboard"
          ariaLive={"polite"}
          onClick={() =>
            copyToClipboard(
              getHrefForSocialSharing({
                lessonSlug: props.lessonSlug,
                selectedActivities: props.selectedActivities,
                schoolUrn: props.schoolUrn,
                linkConfig: shareLinkConfig.copy,
              }),
              () => {
                setIsShareSuccessful(true);
                setCurrentToastProps({
                  message: "Link copied to clipboard",
                  variant: "green",
                  autoDismiss: true,
                  showIcon: true,
                });
                props.onSubmit("copy-link");
              },
            )
          }
          isLoading={false}
          loadingText="Copying..."
          icon={shareLinkConfig.copy.icon}
          disabled={props.disabled}
        />

        {/* Google Classroom – opens the CourseWork modal when a handler is
            provided, otherwise falls back to the generic Classroom share URL */}
        {props.onGoogleClassroomClick ? (
          <LoadingButton
            text={shareLinkConfig.googleClassroom.name}
            icon={shareLinkConfig.googleClassroom.icon}
            isLoading={false}
            disabled={props.disabled}
            type="button"
            key={shareLinkConfig.googleClassroom.name}
            onClick={() => {
              props.onSubmit(shareLinkConfig.googleClassroom.avoMedium);
              props.onGoogleClassroomClick!();
            }}
            ariaLabel="Assign to Google Classroom"
            ariaLive={"polite"}
          />
        ) : (
          <LoadingButton
            text={shareLinkConfig.googleClassroom.name}
            icon={shareLinkConfig.googleClassroom.icon}
            isLoading={false}
            disabled={props.disabled}
            type="link"
            external={true}
            key={shareLinkConfig.googleClassroom.name}
            href={getHrefForSocialSharing({
              lessonSlug: props.lessonSlug,
              selectedActivities: props.selectedActivities,
              linkConfig: shareLinkConfig.googleClassroom,
            })}
            onClick={() =>
              props.onSubmit(shareLinkConfig.googleClassroom.avoMedium)
            }
            ariaLabel="Assign to Google Classroom"
            ariaLive={"polite"}
          />
        )}

        {nonClassroomLinks.map((link) => (
          <LoadingButton
            text={link.name}
            icon={link.icon}
            isLoading={false}
            disabled={props.disabled}
            type="link"
            external={true}
            key={link.name}
            href={getHrefForSocialSharing({
              lessonSlug: props.lessonSlug,
              selectedActivities: props.selectedActivities,
              linkConfig: link,
            })}
            onClick={() => {
              props.onSubmit(link.avoMedium);
            }}
            ariaLabel={`Share to ${link.name}`}
            ariaLive={"polite"}
          />
        ))}
      </OakFlex>
    </>
  );
};

export default LessonShareLinks;
