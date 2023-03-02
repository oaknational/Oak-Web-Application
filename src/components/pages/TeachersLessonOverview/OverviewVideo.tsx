import { FC, useState } from "react";

import Button from "../../Button";
import VideoPlayer from "../../VideoPlayer";
import { P } from "../../Typography";

import OverviewAssetWrap from "./OverviewAssetWrap";

interface OverviewVideoProps {
  video: string;
  signLanguageVideo: string | null;
  title: string;
  hasCaptions: boolean;
}

export const OverviewVideo: FC<OverviewVideoProps> = ({
  video,
  signLanguageVideo,
  title,
  hasCaptions,
}) => {
  const [signLanguageOn, setSignLanguageOn] = useState(false);

  const toggleSignLanguage = () => {
    setSignLanguageOn(!signLanguageOn);
  };

  return (
    <OverviewAssetWrap>
      <VideoPlayer
        playbackId={
          signLanguageVideo && signLanguageOn ? signLanguageVideo : video
        }
        playbackPolicy={"signed"}
        title={title}
        location={"lesson"}
      />
      {signLanguageVideo && !signLanguageOn && (
        <Button
          label="Signed video"
          background="teachersHighlight"
          $mt={20}
          $mb={24}
          icon={"sign-language"}
          $iconPosition={"trailing"}
          onClick={toggleSignLanguage}
          data-testid={"sign-language-button"}
        />
      )}
      {signLanguageVideo && signLanguageOn && (
        <Button
          label="Unsigned video"
          background="teachersHighlight"
          $mt={20}
          $mb={24}
          onClick={toggleSignLanguage}
          data-testid={"sign-language-button"}
        />
      )}
      {!hasCaptions && !signLanguageVideo && (
        <P $mt={24} $textAlign="center">
          Some of our videos, including non-English language videos, do not have
          captions.
        </P>
      )}
    </OverviewAssetWrap>
  );
};

export default OverviewVideo;
