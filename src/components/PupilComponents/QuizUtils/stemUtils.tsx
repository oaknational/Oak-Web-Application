import { OakAllSpacingToken, OakImage } from "@oak-academy/oak-components";

import {
  StemImageObject,
  StemObject,
  StemTextObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";

export const isImage = (obj: StemObject): obj is StemImageObject =>
  obj.type === "image";

export const isText = (obj: StemObject): obj is StemTextObject =>
  obj.type === "text";

export const getStemImageData = (stem: StemObject[]) => {
  const data = stem.find((a) => isImage(a));
  if (data && isImage(data)) return data;
};

export const getStemTextData = (stem: StemObject[]) => {
  const data = stem.find((a) => isText(a));
  if (data && isText(data)) return data;
};

export const getStemImage = ({
  stem,
  minWidth = "all-spacing-19",
}: {
  stem: StemObject[];
  minWidth: OakAllSpacingToken;
}) => {
  const data = getStemImageData(stem);
  if (data)
    return (
      <OakImage
        src={data.image_object.secure_url}
        alt={""} // TODO: add alt text
        width={data.image_object.width}
        height={data.image_object.height}
        $minWidth={minWidth}
      />
    );
};
