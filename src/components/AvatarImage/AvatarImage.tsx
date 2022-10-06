import { max } from "lodash";
import { FC } from "react";

import { SanityImageAsset } from "../../node-lib/sanity-graphql/generated/sdk";
import { PixelSpacing } from "../../styles/theme";
import { ResponsiveValues } from "../../styles/utils/responsive";
import Circle from "../Circle";
import CMSImage from "../CMSImage";
import { FlexProps } from "../Flex";

const DEFAULT_AVATAR_SIZE = 56;

type AvatarImageProps = FlexProps & {
  image?: SanityImageAsset | null;
  size?: ResponsiveValues<PixelSpacing>;
};
const AvatarImage: FC<AvatarImageProps> = (props) => {
  const { size = DEFAULT_AVATAR_SIZE, image, ...flexProps } = props;
  const largestSize = (Array.isArray(size) ? max(size) : size) || 0;
  // for 'retina' screens
  const fetchImageSize = largestSize * 2;
  return (
    <Circle
      $overflow={"hidden"}
      size={size}
      $background="teachersPastelYellow"
      $position={"relative"}
      {...flexProps}
    >
      {image && fetchImageSize ? (
        <CMSImage
          image={image}
          $objectFit={"cover"}
          fill
          imageBuilder={(builder) =>
            builder
              .width(fetchImageSize)
              .height(fetchImageSize)
              .fit("crop")
              .crop("center")
          }
        />
      ) : null}
    </Circle>
  );
};

export default AvatarImage;
