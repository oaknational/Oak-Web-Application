import { FC } from "react";
import { PortableTextProps } from "@portabletext/react";
import { OakFlex } from "@oaknational/oak-components";

import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import Card from "@/components/SharedComponents/Card";
import CardImage, {
  CardImageProps,
} from "@/components/SharedComponents/Card/CardComponents/CardImage";

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
      <OakFlex
        $minWidth={"all-spacing-19"}
        $alignItems="center"
        $mr={["space-between-none", "space-between-xxl"]}
      >
        <CardImage {...image} />
      </OakFlex>
      <OakFlex $alignItems="center" $font={["body-2", "body-1"]}>
        <PortableTextWithDefaults
          value={bodyPortableText}
          withoutDefaultComponents
        />
      </OakFlex>
      <BrushBorders hideOnMobileH color={"pink50"} />
    </Card>
  );
};

export default GenericIntroCard;
