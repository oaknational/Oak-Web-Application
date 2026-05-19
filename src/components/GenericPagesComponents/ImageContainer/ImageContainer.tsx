import { FC } from "react";
import styled from "styled-components";
import { OakFlex } from "@oaknational/oak-components";

import Illustration from "@/components/SharedComponents/Illustration/Illustration";
import { IllustrationSlug } from "@/image-data";

type ImageContainerProps = {
  imageSlug: IllustrationSlug;
  children?: React.ReactNode;
  sizes?: string;
  width?: number;
  height?: number;
};

const FlexWithMaxWidth = styled(OakFlex)`
  max-width: 524px;
`;

const ImageContainer: FC<ImageContainerProps> = (props) => {
  const { imageSlug, children, sizes, width, height } = props;
  return (
    <FlexWithMaxWidth
      $pv={"spacing-64"}
      $flexDirection={"column"}
      $justifyContent={"space-between"}
      $alignItems={"flex-end"}
      $flexGrow={0}
      $flexShrink={1}
      $flexBasis={"auto"}
      $position={"relative"}
      $minWidth={["spacing-0", "spacing-360"]}
      $display={["none", "flex"]}
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
    </FlexWithMaxWidth>
  );
};

export default ImageContainer;
