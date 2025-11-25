import { PropsWithChildren } from "react";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakIcon,
  OakLI,
  OakSvg,
  OakUL,
} from "@oaknational/oak-components";

import CMSImage from "@/components/SharedComponents/CMSImage";
import { getIllustrationAsset } from "@/image-data";

function ListItem({ children }: Readonly<PropsWithChildren>) {
  return (
    <OakLI
      $display="flex"
      $flexDirection="row"
      $alignItems="center"
      $gap="spacing-16"
      $mb="spacing-12"
    >
      <OakIcon
        iconName="tick"
        $height="spacing-32"
        $width="spacing-32"
        alt=""
      />
      {children}
    </OakLI>
  );
}

const RegistrationAside = () => {
  return (
    <OakFlex
      $flexDirection="column"
      $maxWidth="spacing-480"
      $background="bg-decorative1-main"
      $gap="spacing-48"
    >
      <OakFlex $flexDirection="column" $gap="spacing-32">
        <OakBox
          $mb="spacing-32"
          $maxHeight="spacing-240"
          $maxWidth="spacing-160"
        >
          <CMSImage
            image={getIllustrationAsset("auth-acorn")}
            $objectFit="contain"
          />
        </OakBox>
        <OakFlex $flexDirection="column" $position="relative">
          <OakHeading tag="h2" $font="heading-4">
            Our resources will
          </OakHeading>
          <OakBox $zIndex="in-front">
            <OakHeading tag="h2" $font="heading-4">
              always be free.
            </OakHeading>
          </OakBox>
          <OakSvg
            name="scribble"
            $position="absolute"
            $bottom="spacing-0"
            $height="spacing-40"
            $transform="scaleX(1.05)"
            $left="spacing-4"
          />
        </OakFlex>
        <OakFlex $flexDirection="column" $gap="spacing-16">
          <OakHeading tag="h3" $font="heading-6">
            Signing up gives you
          </OakHeading>
          <OakUL $font="body-1" $reset>
            <ListItem>Full unit downloads</ListItem>
            <ListItem>Curriculum plans designed by curriculum experts</ListItem>
            <ListItem>Priority access to new products and features</ListItem>
            <ListItem>Instant access to Aila, our AI lesson assistant</ListItem>
          </OakUL>
        </OakFlex>
      </OakFlex>
    </OakFlex>
  );
};

export default RegistrationAside;
