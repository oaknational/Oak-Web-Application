import { FC, useEffect, useState } from "react";
import { OakHeading, OakFlex } from "@oaknational/oak-components";

import { shareLinkConfig } from "./linkConfig";
import { getHrefForSocialSharing } from "./getHrefForSocialSharing";

import { ResourceType } from "@/components/TeacherComponents/types/downloadAndShare.types";
import LoadingButton from "@/components/SharedComponents/Button/LoadingButton";
import { ShareMediumValueType } from "@/browser-lib/avo/Avo";

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
  schoolUrn?: number;
  onSubmit: (shareMedium: ShareMediumValueType) => void;
  usePupils: boolean;
}> = (props) => {
  const [isShareSuccessful, setIsShareSuccessful] = useState(false);

  useEffect(() => {
    setIsShareSuccessful(false);
  }, [props.selectedActivities]);

  return (
    <>
      <OakHeading
        $mt="space-between-m"
        $mb="space-between-sssx"
        tag={"h4"}
        $font={"heading-7"}
      >
        Share options:
      </OakHeading>
      <OakFlex $flexWrap={"wrap"} $width={"100%"} $gap={"all-spacing-3"}>
        <LoadingButton
          text={
            isShareSuccessful
              ? "Link copied to clipboard"
              : shareLinkConfig.copy.name
          }
          success={isShareSuccessful}
          type="button"
          ariaLabel="Copy link to clipboard"
          aria-live={"polite"}
          onClick={() =>
            copyToClipboard(
              getHrefForSocialSharing({
                lessonSlug: props.lessonSlug,
                selectedActivities: props.selectedActivities,
                schoolUrn: props.schoolUrn,
                linkConfig: shareLinkConfig.copy,
                usePupils: props.usePupils,
              }),
              () => {
                setIsShareSuccessful(true);
                props.onSubmit("copy-link");
              },
            )
          }
          isLoading={false}
          loadingText="Copying..."
          icon={shareLinkConfig.copy.icon}
          disabled={props.disabled}
        />

        {[
          shareLinkConfig.googleClassroom,
          shareLinkConfig.microsoftTeams,
          shareLinkConfig.email,
        ].map((link) => (
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
              usePupils: props.usePupils,
            })}
            onClick={() => {
              props.onSubmit(link.avoMedium);
            }}
            ariaLabel={`Share to ${link.name}`}
          />
        ))}
      </OakFlex>
    </>
  );
};

export default LessonShareLinks;
