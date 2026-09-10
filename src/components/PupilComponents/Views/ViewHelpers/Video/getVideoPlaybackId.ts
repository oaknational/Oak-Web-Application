export const getVideoPlaybackId = ({
  signLanguageOn,
  videoMuxPlaybackId,
  videoWithSignLanguageMuxPlaybackId,
}: {
  signLanguageOn: boolean;
  videoMuxPlaybackId?: string;
  videoWithSignLanguageMuxPlaybackId?: string;
}) => {
  return signLanguageOn && videoWithSignLanguageMuxPlaybackId
    ? videoWithSignLanguageMuxPlaybackId
    : videoMuxPlaybackId;
};
