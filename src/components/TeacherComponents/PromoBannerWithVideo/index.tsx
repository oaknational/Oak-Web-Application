import {
  OakFlex,
  OakHeading,
  OakIconName,
  OakP,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import styled from "styled-components";
import { useState } from "react";

import { StyledVideoFlex } from "../NewContentBanner/NewContentBanner";

import VideoPlayer, {
  VideoEventCallbackArgs,
} from "@/components/SharedComponents/VideoPlayer";

type PromoBannerWithVideoProps = {
  title: string;
  text: string;
  buttonText: string;
  href?: string;
  onClick?: () => void;
  videoPlaybackID: string;
  buttonIconName: OakIconName;
  textUnderVideo?: string;
};

const StyledOakFlex = styled(OakFlex)`
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
`;

const PromoBannerWithVideo = ({
  title,
  text,
  buttonText,
  href,
  onClick,
  videoPlaybackID,
  buttonIconName,
  textUnderVideo,
}: PromoBannerWithVideoProps) => {
  const [expandVideo, setExpandVideo] = useState(false);
  const handleVideoEvent = (event: VideoEventCallbackArgs) => {
    if (event.event === "playing") {
      setExpandVideo(true);
    } else {
      setExpandVideo(false);
    }
  };

  return (
    <StyledOakFlex
      $flexDirection={["column-reverse", "row"]}
      $alignItems={"center"}
      $justifyContent={"space-between"}
      $mv={"space-between-m"}
      $borderColor={"grey40"}
      $dropShadow={"drop-shadow-grey"}
      $borderRadius={"border-radius-m2"}
      $gap={"space-between-m2"}
      $pa={"inner-padding-xl"}
    >
      <OakFlex $flexDirection={"column"} $gap={"space-between-xs"}>
        <OakHeading tag="h2" $font={"heading-5"}>
          {title}
        </OakHeading>
        <OakP $font={"body-2"}>{text}</OakP>
        <OakTertiaryButton
          iconName={buttonIconName}
          isTrailingIcon
          element={href ? "a" : "button"}
          onClick={onClick}
          href={href}
        >
          {buttonText}
        </OakTertiaryButton>
      </OakFlex>
      <StyledVideoFlex
        $alignSelf={["flex-start", "center"]}
        expand={expandVideo}
        $flexDirection={"column"}
        $width={expandVideo ? ["100%", "all-spacing-21"] : "all-spacing-19"}
        data-testid="video-player-container"
      >
        <VideoPlayer
          playbackId={videoPlaybackID}
          playbackPolicy={"public"}
          title={"Oak Promo Video"}
          location={"marketing"}
          isLegacy={false}
          thumbnailTime={30.8}
          userEventCallback={handleVideoEvent}
        />
        {textUnderVideo && <OakP $font={"body-3-bold"}>{textUnderVideo}</OakP>}
      </StyledVideoFlex>
    </StyledOakFlex>
  );
};

export default PromoBannerWithVideo;
