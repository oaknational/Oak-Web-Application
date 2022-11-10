import { SizeValues } from "../../styles/utils/size";

export const getVideoThumbnail = (
  mainImage: string,
  thumbTime: number | null = 20,
  width: SizeValues = 400,
  height: SizeValues = 200
) => {
  return `https://image.mux.com/${mainImage}/thumbnail.png?width=${width}&height=${height}&fit_mode=smartcrop&time=${thumbTime}`;
};
