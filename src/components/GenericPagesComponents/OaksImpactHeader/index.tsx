import {
  OakVideo,
  OakFlex,
  OakHeading,
  OakBox,
  parseSpacing,
  OakP,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { NewGutterMaxWidth } from "../NewGutterMaxWidth";

import { Video } from "@/common-lib/cms-types";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";

const Layout = styled(OakFlex)`
  @media (min-width: 0px) AND (max-width: 749px) {
    flex-direction: column;
    padding-top: ${parseSpacing("spacing-56")};
    padding-bottom: ${parseSpacing("spacing-72")};
    gap: ${parseSpacing("spacing-16")};
  }
  @media (min-width: 750px) AND (max-width: 999px) {
    flex-direction: column;
    padding-top: ${parseSpacing("spacing-80")};
    padding-bottom: ${parseSpacing("spacing-80")};
    gap: ${parseSpacing("spacing-16")};
  }
  @media (min-width: 1000px) AND (max-width: 1279px) {
    flex-direction: row;
    padding-top: ${parseSpacing("spacing-80")};
    padding-bottom: ${parseSpacing("spacing-80")};
    gap: ${parseSpacing("spacing-40")};
  }
  @media (min-width: 1280px) {
    flex-direction: row;
    padding-top: ${parseSpacing("spacing-56")};
    padding-bottom: ${parseSpacing("spacing-56")};
    gap: ${parseSpacing("spacing-16")};
  }
`;

const VideoLayout = styled(OakBox)`
  @media (min-width: 0px) AND (max-width: 749px) {
    width: ${parseSpacing("100%")};
  }
  @media (min-width: 750px) AND (max-width: 999px) {
    width: ${parseSpacing("100%")};
  }
  @media (min-width: 1000px) AND (max-width: 1279px) {
    width: ${parseSpacing("spacing-480")};
  }
  @media (min-width: 1280px) {
    width: ${parseSpacing("spacing-640")};
  }
`;

const LeftTextLayout = styled(OakFlex)`
  @media (min-width: 1000px) AND (max-width: 1279px) {
    height: ${parseSpacing("spacing-360")};
  }
  @media (min-width: 1280px) {
    height: ${parseSpacing("spacing-480")};
  }
`;

export type OaksImpactHeaderProps = {
  title: string;
  body: string;
  video: Video;
  videoDescription: string;
};
export function OaksImpactHeader({
  videoDescription,
  video,
  title,
  body,
}: Readonly<OaksImpactHeaderProps>) {
  return (
    <NewGutterMaxWidth>
      <Layout>
        <LeftTextLayout
          $justifyContent={"center"}
          $alignItems={"flex-start"}
          $flexDirection={"column"}
          $gap={"spacing-24"}
        >
          <OakFlex
            $alignItems={"flex-start"}
            $background={"bg-decorative2-main"}
            $ph={"spacing-4"}
            $gap={"spacing-8"}
          >
            <OakHeading
              tag={"h1"}
              $color={"text-primary"}
              $font={["heading-4", "heading-2", "heading-2"]}
            >
              {title}
            </OakHeading>
          </OakFlex>
          <OakP
            $color={"text-primary"}
            $font={["heading-light-5", "heading-light-3", "heading-light-3"]}
          >
            {body}
          </OakP>
        </LeftTextLayout>
        <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
          <VideoLayout>
            <OakVideo
              videoSlot={
                <VideoPlayer
                  playbackPolicy="public"
                  thumbnailTime={video.video.asset.thumbTime}
                  playbackId={video.video.asset.playbackId}
                  title={video.title}
                  isLegacy={false}
                  location="marketing"
                  omitBorder={true}
                />
              }
              body={videoDescription}
              transcript={video.transcript ?? undefined}
              showTranscript={true}
            />
          </VideoLayout>
        </OakFlex>
      </Layout>
    </NewGutterMaxWidth>
  );
}
