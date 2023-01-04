import { FC, useState } from "react";

import Button from "../../Button";
import VideoPlayer from "../../VideoPlayer";

import OverviewAssetWrap from "./OverviewAssetWrap";

interface OverviewVideoProps {
  video: string;
  signLanguageVideo?: string;
  lessonTitle: string;
}

export const OverviewVideo: FC<OverviewVideoProps> = ({
  video,
  signLanguageVideo,
  lessonTitle,
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
        title={lessonTitle}
        location={"lesson"}
      />
      {signLanguageVideo && !signLanguageOn && (
        <Button
          label="Signed video"
          background="teachersHighlight"
          $mt={20}
          $mb={24}
          icon={"SignLanguage"}
          $iconPosition={"trailing"}
          onClick={toggleSignLanguage}
          data-testid={"sign-language-button"}
        />
      )}
      {signLanguageVideo && signLanguageOn && (
        <Button
          label="Unsigned"
          background="teachersHighlight"
          $mt={20}
          $mb={24}
          onClick={toggleSignLanguage}
          data-testid={"sign-language-button"}
        />
      )}
    </OverviewAssetWrap>
  );
};

export default OverviewVideo;
