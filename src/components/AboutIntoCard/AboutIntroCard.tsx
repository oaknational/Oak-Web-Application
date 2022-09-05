import { FC } from "react";
import { PortableText, PortableTextProps } from "@portabletext/react";

import Card from "../Card";
import Flex from "../Flex";
import CardImage, { CardImageProps } from "../Card/CardComponents/CardImage";
import Typography from "../Typography";

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
        <CardImage imageSrc={image.imageSrc} alt={image.alt} />
      </Flex>
      <Flex $alignItems="center">
        <Typography $fontSize={[16, 18]}>
          <PortableText value={bodyPortableText} />
        </Typography>
      </Flex>
    </Card>
  );
};

export default AboutIntroCard;
