import { FC } from "react";
import { PortableTextProps } from "@portabletext/react";

import { PortableTextWithDefaults } from "@/components/PortableText";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import Card from "@/components/SharedComponents/Card";
import CardImage, {
  CardImageProps,
} from "@/components/SharedComponents/Card/CardComponents/CardImage";
import Flex from "@/components/SharedComponents/Flex";

type GenericIntroCardProps = {
  image: CardImageProps;
  bodyPortableText: PortableTextProps["value"];
};

const GenericIntroCard: FC<GenericIntroCardProps> = ({
  bodyPortableText,
  image,
}) => {
  return (
    <Card
      $flexDirection={["column-reverse", "row"]}
      $mv={[80, 92]}
      $background={"pink50"}
      $ph={[16, 32]}
      $pv={32}
    >
      <Flex $minWidth={240} $alignItems="center" $mr={[0, 72]}>
        <CardImage {...image} />
      </Flex>
      <Flex $alignItems="center" $font={["body-2", "body-1"]}>
        <PortableTextWithDefaults
          value={bodyPortableText}
          withoutDefaultComponents
        />
      </Flex>
      <BrushBorders hideOnMobileH color={"pink50"} />
    </Card>
  );
};

export default GenericIntroCard;
