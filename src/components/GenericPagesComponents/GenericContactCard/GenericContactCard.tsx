import { FC } from "react";
import { PortableTextComponents } from "@portabletext/react";
import {
  OakGrid,
  OakGridArea,
  OakTypography,
  OakHeading,
  OakFlex,
  OakPrimaryButton,
} from "@oaknational/oak-components";

import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";
import NewsletterFormWrap from "@/components/GenericPagesComponents/NewsletterFormWrap";
import { PortableTextJSON } from "@/common-lib/cms-types";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import Card from "@/components/SharedComponents/Card";
import { resolveOakHref } from "@/common-lib/urls";

const genericContactCardPortableTextComponents: PortableTextComponents = {
  block: {
    sectionHeading: (props) => {
      return (
        <OakHeading
          $mb="space-between-ssx"
          $font={["heading-6", "heading-5"]}
          tag="h2"
        >
          {props.children}
        </OakHeading>
      );
    },
    normal: (props) => {
      return (
        <OakTypography $mb="space-between-m2" $font={["body-2", "body-1"]}>
          {props.children}
        </OakTypography>
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
    <OakFlex $position={"relative"} $width={"100%"}>
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
            <OakFlex $mb={["space-between-m2", "space-between-none"]}>
              <OakPrimaryButton
                element="a"
                href={resolveOakHref({ page: "contact" })}
              >
                Contact us
              </OakPrimaryButton>
            </OakFlex>
          </Card>
        </OakGridArea>
        <OakGridArea
          $mb={["space-between-xxxl", "space-between-none"]}
          $order={[1, 2]}
          $colSpan={[12, 6, 4]}
        >
          <OakFlex
            $background={"mint50"}
            $pa={["inner-padding-none", "inner-padding-xl"]}
          >
            <NewsletterFormWrap onSubmit={onSubmit} />
          </OakFlex>
        </OakGridArea>
      </OakGrid>
    </OakFlex>
  );
};

export default GenericContactCard;
