import {
  OakAllSpacingToken,
  OakCloudinaryImage,
} from "@oaknational/oak-components";

import {
  ImageItem,
  TextItem,
  ImageOrTextItem,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";

export const isImage = (obj?: ImageOrTextItem): obj is ImageItem =>
  obj?.type === "image";

export const isText = (obj?: ImageOrTextItem): obj is TextItem =>
  obj?.type === "text";

export const getStemImageData = (stem: ImageOrTextItem[]) => {
  const data = stem.find((a) => isImage(a));
  if (data && isImage(data)) return data;
};

export const getStemTextData = (stem: ImageOrTextItem[]) => {
  const data = stem.find((a) => isText(a));
  if (data && isText(data)) return data;
};

export const getStemImage = ({
  stem,
  minWidth = "all-spacing-19",
  scaled = false,
}: {
  stem: ImageOrTextItem[];
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
        $minWidth={minWidth}
        $maxWidth={scaled ? "all-spacing-21" : "all-spacing-0"}
        placeholder="oak"
        sizes={getSizes(["100vw", scaled ? 3000 : 1200])}
        role="presentation"
      />
    );
};
