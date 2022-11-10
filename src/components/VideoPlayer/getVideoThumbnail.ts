import { SizeValues } from "../../styles/utils/size";

export const getVideoThumbnail = ({
  mainImage,
  thumbTime,
  width = 400,
  height = 200,
}: {
  mainImage: string;
  thumbTime?: number | null;
  width?: SizeValues;
  height?: SizeValues;
}) => {
  return `https://image.mux.com/${mainImage}/thumbnail.png?width=${width}&height=${height}&fit_mode=smartcrop&time=${
    thumbTime ? thumbTime : 20
  }`;
};
