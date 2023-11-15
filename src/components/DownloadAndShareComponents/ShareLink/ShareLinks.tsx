import { FC, useEffect, useState } from "react";

import { ResourceType } from "../downloadsAndShare.types";

import { shareLinkConfig } from "./linkConfig";
import { getHrefForSocialSharing } from "./getHrefForSocialSharing";

import LoadingButton from "@/components/Button/LoadingButton";
import Flex from "@/components/Flex";
import { Heading } from "@/components/Typography";
import { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import { PupilActivityResourceTypesValueType } from "@/browser-lib/avo/Avo";
import { getSchoolOption } from "@/components/DownloadAndShareComponents/helpers/getFormattedDetailsForTracking";

const copyToCliboard = (textToCopy: string, callback: () => void) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(textToCopy);
    callback();
  } else {
    alert("Please update your browser to support this feature");
  }
};

const classroomActivityMap: Partial<
  Record<ResourceType, PupilActivityResourceTypesValueType>
> = {
  "intro-quiz-questions": "starter-quiz",
  "exit-quiz-questions": "exit-quiz",
  "worksheet-pdf": "worksheet",
  video: "video",
};

const ShareLinks: FC<{
  disabled: boolean;
  lessonSlug: string;
  lessonTitle: string;
  selectedActivities?: Array<ResourceType>;
  schoolUrn?: number;
  schoolName: string;
  onSubmit: () => void;
  lessonShared: TrackFns["lessonShared"];
  emailSupplied: boolean;
}> = (props) => {
  const [isShareSuccessful, setIsShareSuccessful] = useState(false);

  useEffect(() => {
    setIsShareSuccessful(false);
  }, [props.selectedActivities]);

  const pupilActivityResource = props.selectedActivities?.map((activity) => {
    const resource = classroomActivityMap[activity];
    return resource;
  }) as PupilActivityResourceTypesValueType[];

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
            copyToCliboard(
              getHrefForSocialSharing({
                lessonSlug: props.lessonSlug,
                selectedActivities: props.selectedActivities,
                schoolUrn: props.schoolUrn,
                linkConfig: shareLinkConfig.copy,
              }),
              () => {
                setIsShareSuccessful(true);

                props.lessonShared({
                  lessonName: props.lessonTitle,
                  lessonSlug: props.lessonSlug,
                  schoolUrn: props?.schoolUrn ?? 0,
                  schoolName: props.schoolName ?? "",
                  schoolOption: getSchoolOption(props.schoolName),
                  shareMedium: "copy-link",
                  pupilActivityResourceTypes: pupilActivityResource,
                  emailSupplied: props.emailSupplied,
                });
                props.onSubmit();
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
              props.onSubmit();
              props.lessonShared({
                lessonName: props.lessonTitle,
                lessonSlug: props.lessonSlug,
                schoolUrn: props?.schoolUrn ?? 0,
                schoolName: props.schoolName ?? "",
                schoolOption: getSchoolOption(props.schoolName),
                shareMedium: link.avoMedium,
                pupilActivityResourceTypes: pupilActivityResource,
                emailSupplied: props.emailSupplied,
              });
            }}
            ariaLabel={`Share to ${link.name}`}
          />
        ))}
      </Flex>
    </>
  );
};

export default ShareLinks;
