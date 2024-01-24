import { FC } from "react";
import { PortableTextComponents } from "@portabletext/react";
import { OakGrid, OakGridArea } from "@oak-academy/oak-components";

import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";
import NewsletterFormWrap from "@/components/GenericPagesComponents/NewsletterFormWrap";
import { PortableTextJSON } from "@/common-lib/cms-types";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import Typography, { Heading } from "@/components/SharedComponents/Typography";
import Card from "@/components/SharedComponents/Card";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Flex from "@/components/SharedComponents/Flex";

const genericContactCardPortableTextComponents: PortableTextComponents = {
  block: {
    sectionHeading: (props) => {
      return (
        <Heading $mb={8} $font={["heading-6", "heading-5"]} tag="h2">
          {props.children}
        </Heading>
      );
    },
    normal: (props) => {
      return (
        <Typography $mb={32} $font={["body-2", "body-1"]}>
          {props.children}
        </Typography>
      );
    },
  },
};

type GenericContactCardProps = {
  infoPortableText: PortableTextJSON;
};

const GenericContactCard: FC<GenericContactCardProps> = (props) => {
  const { onSubmit } = useNewsletterForm();
  return (
    <Flex $position={"relative"} $width={"100%"}>
      <BrushBorders hideOnMobileH hideOnMobileV color={"mint50"} />
      <OakGrid>
        <OakGridArea $order={[2, 1]} $colSpan={[12, 6, 8]}>
          <Card
            $pa={[16, 24]}
            $justifyContent={["center"]}
            $background={"mint50"}
            $pt={[32, 0]}
          >
            <PortableTextWithDefaults
              components={genericContactCardPortableTextComponents}
              value={props.infoPortableText}
            />
            <Flex $mb={[32, 0]}>
              <ButtonAsLink label={"Contact us"} page="contact" />
            </Flex>
          </Card>
        </OakGridArea>
        <OakGridArea
          $mb={["space-between-xxxl", "space-between-none"]}
          $order={[1, 2]}
          $colSpan={[12, 6, 4]}
        >
          <Flex $background={"mint50"} $pa={[0, 24]}>
            <NewsletterFormWrap onSubmit={onSubmit} />
          </Flex>
        </OakGridArea>
      </OakGrid>
    </Flex>
  );
};

export default GenericContactCard;
