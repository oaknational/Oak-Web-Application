import { FC } from "react";

import Flex from "@/components/Flex/Flex";
import Illustration from "@/components/Illustration/Illustration";
import { IllustrationSlug } from "@/image-data";

type ImageContainerProps = {
  imageSlug: IllustrationSlug;
  children: React.ReactNode;
};

const ImageContainer: FC<ImageContainerProps> = (props) => {
  const { imageSlug, children } = props;
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
      data-testid="image-container"
    >
      <Illustration
        slug={imageSlug}
        noCrop
        $objectFit="contain"
        priority
        $ba={3}
        $borderStyle={"solid"}
        $borderColor={"black"}
      />
      {children}
    </Flex>
  );
};

export default ImageContainer;
