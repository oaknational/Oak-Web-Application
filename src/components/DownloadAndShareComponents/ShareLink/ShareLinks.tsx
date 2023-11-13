import { FC, useState } from "react";
import Link from "next/link";

import { ResourceType } from "../downloadsAndShare.types";

import { shareLinkConfig } from "./linkConfig";
import { getHrefForSocialSharing } from "./getHrefForSocialSharing";

import LoadingButton from "@/components/Button/LoadingButton";
import Flex from "@/components/Flex";
import { Heading, P } from "@/components/Typography";
import ButtonBorders from "@/components/SpriteSheet/BrushSvgs/ButtonBorders";
import Icon from "@/components/Icon";

const copyToCliboard = (textToCopy: string, callback: () => void) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(textToCopy);
    callback();
  } else {
    alert("Please update your browser to support this feature");
  }
};

const CopySuccess: FC = () => {
  return (
    <>
      <Flex
        $background="oakGreen"
        $width="max-content"
        $ph={24}
        $pv={10}
        $alignItems="center"
        $gap={8}
        $position="relative"
      >
        <P $font="heading-7" color="white">
          Link copied to clipboard
        </P>{" "}
        <Icon name="tick" $color="white" />
        <ButtonBorders background="oakGreen" />
      </Flex>
    </>
  );
};

export const ShareLinks: FC<{
  disabled: boolean;
  lessonSlug: string;
  selectedActivities?: Array<ResourceType>;
  schoolUrn?: string; // TODO: schoolurn
}> = (props) => {
  const [isShareSuccessful, setIsShareSuccessful] = useState(false);
  return (
    <>
      <Heading $mt={24} $mb={4} tag={"h4"} $font={"heading-7"}>
        Share options:
      </Heading>
      <Flex $flexWrap={"wrap"} $width={"100%"} $gap={12}>
        {isShareSuccessful ? (
          <CopySuccess />
        ) : (
          <LoadingButton
            text={shareLinkConfig.copy.name}
            onClick={() =>
              copyToCliboard(
                getHrefForSocialSharing(
                  {
                    lessonSlug: props.lessonSlug,
                    selectedActivities: props.selectedActivities,
                    medium: shareLinkConfig.copy.medium,
                  },
                  shareLinkConfig.copy,
                ),
                () => setIsShareSuccessful(true),
              )
            }
            isLoading={false}
            loadingText="Copying..."
            icon={shareLinkConfig.copy.icon}
            disabled={props.disabled}
          />
        )}
        {[
          shareLinkConfig.googleClassroom,
          shareLinkConfig.microsoftTeams,
          shareLinkConfig.email,
        ].map((link) => (
          <Link
            href={getHrefForSocialSharing(
              {
                network: link.network,
                lessonSlug: props.lessonSlug,
                selectedActivities: props.selectedActivities,
                medium: link.medium,
              },
              link,
            )}
            target="_blank"
          >
            <LoadingButton
              text={link.name}
              icon={link.icon}
              isLoading={false}
              disabled={props.disabled}
              onClick={() => {}}
            />
          </Link>
        ))}
      </Flex>
    </>
  );
};
