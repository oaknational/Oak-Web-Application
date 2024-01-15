import { FC, useEffect, useState } from "react";


import { shareLinkConfig } from "./linkConfig";
import { getHrefForSocialSharing } from "./getHrefForSocialSharing";

import { ResourceType } from "@/components/DownloadAndShareComponents/downloadAndShare.types";
import LoadingButton from "@/components/SharedComponents/Button/LoadingButton";
import Flex from "@/components/SharedComponents/Flex";
import { Heading } from "@/components/SharedComponents/Typography";
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
}> = (props) => {
  const [isShareSuccessful, setIsShareSuccessful] = useState(false);

  useEffect(() => {
    setIsShareSuccessful(false);
  }, [props.selectedActivities]);

  return (
    <>
      <Heading $mt={24} $mb={4} tag={"h4"} $font={"heading-7"}>
        Share options:
      </Heading>
      <Flex $flexWrap={"wrap"} $width={"100%"} $gap={12}>
        <LoadingButton
          text={
            isShareSuccessful
              ? "Link copied to clipboard"
              : shareLinkConfig.copy.name
          }
          success={isShareSuccessful}
          type="button"
          ariaLabel="Copy link to clipboard"
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
            })}
            onClick={() => {
              props.onSubmit(link.avoMedium);
            }}
            ariaLabel={`Share to ${link.name}`}
          />
        ))}
      </Flex>
    </>
  );
};

export default LessonShareLinks;
