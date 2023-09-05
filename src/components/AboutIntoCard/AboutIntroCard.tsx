import { FC } from "react";
import { PortableTextProps } from "@portabletext/react";

import Card from "../Card";
import Flex from "../Flex";
import CardImage, { CardImageProps } from "../Card/CardComponents/CardImage";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";
import { PortableTextWithDefaults } from "../PortableText";

type AboutIntroCardProps = {
  image: CardImageProps;
  bodyPortableText: PortableTextProps["value"];
};

const AboutIntroCard: FC<AboutIntroCardProps> = ({
  bodyPortableText,
  image,
}) => {
  return (
    <Card
      $flexDirection={["column-reverse", "row"]}
      $mv={[80, 92]}
      $background={"twilight"}
      $ph={[16, 32]}
      $pv={32}
    >
      <Flex $minWidth={240} $alignItems="center" $mr={[0, 72]}>
        <CardImage {...image} />
      </Flex>
      <Flex $alignItems="center" $font={["body-2", "body-1"]}>
        <PortableTextWithDefaults value={bodyPortableText} />
      </Flex>
      <BrushBorders hideOnMobileH color={"twilight"} />
    </Card>
  );
};

export default AboutIntroCard;
