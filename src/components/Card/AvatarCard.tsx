import { FC } from "react";
import Image from "next/image";

import Flex from "../Flex";
import { Heading, P } from "../Typography";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import IconButtonAsLink from "../Button/IconButtonAsLink";
import ButtonAsLink from "../Button/ButtonAsLink";

import Card from "./Card";

type AvatarCardProps = {
  //   title: string;
  //   heading: string;
  //   summary: PortableTextSpan | string;
  //   background: OakColorName;
  //   image?: CardImageProps;
};

const AvatarCard: FC<AvatarCardProps> = () => {
  return (
    <Card $pa={16}>
      <BoxBorders />
      <Flex
        $flexDirection={["row", "column"]}
        $justifyContent={"space-between"}
      >
        <Flex $alignItems={"center"}>
          <Flex
            $position={"relative"}
            $width={[48, 72]}
            $height={[48, 72]}
            $overflow={"hidden"}
            $borderRadius={"50%"}
          >
            <Image
              layout="fill"
              objectFit="cover"
              alt={""}
              src={"/images/illustrations/classroom.svg"}
            />
          </Flex>
          <Flex
            $ml={[12, 24]}
            $flexDirection={"column"}
            $justifyContent="center"
          >
            <Heading tag="h4" $fontSize={[16, 20]}>
              Matt Hood
            </Heading>
            <P>CEO</P>
          </Flex>
        </Flex>
        <Flex
          $alignItems={"center"}
          $mt={[0, 24]}
          $justifyContent={"space-between"}
        >
          <Flex $alignItems={"center"} $display={["none", "flex"]}>
            <IconButtonAsLink
              aria-label={"twitter"}
              icon={"Twitter"}
              href={"https://twitter.com/oaknational"}
              variant={"minimal"}
              $mr={12}
              size={"tiny"}
            />
            <IconButtonAsLink
              aria-label={"instagram"}
              icon={"Instagram"}
              href={"https://twitter.com/oaknational"}
              variant={"minimal"}
              $mr={12}
              size={"tiny"}
            />
          </Flex>

          <ButtonAsLink
            iconPosition="trailing"
            icon="ArrowRight"
            label={"see bio"}
            href={"/"}
            variant={"minimal"}
            iconBackground={"teachersHighlight"}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default AvatarCard;
