import type { SizeValues } from "@/styles/theme/types";

type GetVideoThumbnailProps = {
  video: { playbackId: string; thumbTime: number | null };
  width?: SizeValues;
  height?: SizeValues;
};
export const getVideoThumbnail = ({
  video,
  width = 400,
  height = 200,
}: GetVideoThumbnailProps) => {
  const { playbackId, thumbTime = 200 } = video;
  return `https://image.mux.com/${playbackId}/thumbnail.png?width=${width}&height=${height}&fit_mode=smartcrop&time=${thumbTime}`;
};
