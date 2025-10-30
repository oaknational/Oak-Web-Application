import {
  OakAllSpacingToken,
  OakCloudinaryImage,
} from "@oaknational/oak-components";

import {
  ImageItem,
  TextItem,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import {
  StemImageObject,
  StemTextObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";

export const isImage = (
  obj?: StemImageObject | StemTextObject,
): obj is ImageItem => obj?.type === "image";

export const isText = (
  obj?: StemImageObject | StemTextObject,
): obj is TextItem => obj?.type === "text";

export const getStemImageData = (
  stem: (StemImageObject | StemTextObject)[],
) => {
  const data = stem.find((a) => isImage(a));
  if (data && isImage(data)) return data;
};

export const getStemTextData = (stem: (StemImageObject | StemTextObject)[]) => {
  const data = stem.find((a) => isText(a));
  if (data && isText(data)) return data;
};

export const getStemImage = ({
  stem,
  minWidth = "all-spacing-19",
  scaled = false,
}: {
  stem: (StemImageObject | StemTextObject)[];
  minWidth: OakAllSpacingToken;
  scaled?: boolean;
}) => {
  const data = getStemImageData(stem);
  if (data?.imageObject?.publicId)
    return (
      <OakCloudinaryImage
        cloudinaryId={data.imageObject.publicId}
        alt={"An image in a quiz"}
        width={data.imageObject.width}
        height={data.imageObject.height}
        $minWidth={scaled ? "all-spacing-20" : minWidth}
        placeholder="oak"
        sizes={getSizes(["100vw", 1200])}
        role="presentation"
      />
    );
};
