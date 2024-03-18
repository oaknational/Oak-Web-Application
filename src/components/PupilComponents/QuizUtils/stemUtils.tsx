import {
  OakAllSpacingToken,
  OakCloudinaryImage,
} from "@oaknational/oak-components";

import {
  StemImageObject,
  StemObject,
  StemTextObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";

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
  if (data?.image_object?.public_id)
    return (
      <OakCloudinaryImage
        cloudinaryId={data.image_object.public_id}
        alt={""} // TODO: add alt text
        width={data.image_object.width}
        height={data.image_object.height}
        $minWidth={minWidth}
        placeholder="oak"
        sizes={getSizes(["100vw", 1200])}
      />
    );
};
