import { max } from "lodash";
import { FC } from "react";

import { Image } from "@/common-lib/cms-types";
import { PixelSpacing } from "@/styles/theme";
import { ResponsiveValues } from "@/styles/utils/responsive";
import Circle from "@/components/SharedComponents/Circle";
import CMSImage from "@/components/SharedComponents/CMSImage";
import { FlexProps } from "@/components/SharedComponents/Flex.deprecated";

const DEFAULT_AVATAR_SIZE = 56;

type AvatarImageProps = FlexProps & {
  image?: Image | null;
  size?: ResponsiveValues<PixelSpacing>;
};
const AvatarImage: FC<AvatarImageProps> = (props) => {
  const { size = DEFAULT_AVATAR_SIZE, image, ...flexProps } = props;
  const largestSize = (Array.isArray(size) ? max(size) : size) || 0;

  return (
    <Circle
      $overflow={"hidden"}
      size={size}
      $background="lemon50"
      $position={"relative"}
      {...flexProps}
    >
      {image && largestSize ? (
        <CMSImage
          image={image}
          $objectFit={"cover"}
          width={largestSize}
          height={largestSize}
        />
      ) : null}
    </Circle>
  );
};

export default AvatarImage;
