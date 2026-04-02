import { FC } from "react";

import Flex from "@/components/SharedComponents/Flex.deprecated";
import Illustration from "@/components/SharedComponents/Illustration/Illustration";
import { IllustrationSlug } from "@/image-data";

type ImageContainerProps = {
  imageSlug: IllustrationSlug;
  children?: React.ReactNode;
  sizes?: string;
  width?: number;
  height?: number;
};

const ImageContainer: FC<ImageContainerProps> = (props) => {
  const { imageSlug, children, sizes, width, height } = props;
  return (
    <Flex
      $pv={64}
      $flexDirection={"column"}
      $justifyContent={"space-between"}
      $alignItems={"flex-end"}
      $flex={"0 1 auto"}
      $position={"relative"}
      $minWidth={[0, 350]}
      $display={["none", "flex"]}
      $maxWidth={524}
      $width="100%"
      data-testid="image-container"
    >
      <Illustration
        slug={imageSlug}
        sizes={sizes}
        noCrop
        $objectFit="contain"
        priority
        $ba={3}
        $borderStyle={"solid"}
        $borderColor={"black"}
        width={width}
        height={height}
      />
      {children}
    </Flex>
  );
};

export default ImageContainer;
