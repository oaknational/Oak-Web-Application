import { FC } from "react";
import { OakFlex, OakFlexProps } from "@oaknational/oak-components";

import { Image } from "@/common-lib/cms-types";
import CMSImage from "@/components/SharedComponents/CMSImage";

type AvatarImageProps = OakFlexProps & {
  image?: Image | null;
};
const AvatarImage: FC<AvatarImageProps> = (props) => {
  const { image, ...flexProps } = props;

  return (
    <OakFlex
      $overflow={"hidden"}
      $width={"spacing-56"}
      $height={"spacing-56"}
      $position={"relative"}
      $borderRadius="border-radius-circle"
      $justifyContent={"center"}
      $alignItems={"center"}
      {...flexProps}
    >
      {image ? (
        <CMSImage image={image} $objectFit={"cover"} width={56} height={56} />
      ) : null}
    </OakFlex>
  );
};

export default AvatarImage;
