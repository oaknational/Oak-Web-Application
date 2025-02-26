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

function ListItem({ children }: PropsWithChildren) {
  return (
    <OakLI
      $display="flex"
      $flexDirection="row"
      $alignItems="center"
      $gap="space-between-s"
      $mb="space-between-xs"
    >
      <OakIcon iconName="tick" $height="all-spacing-7" $width="all-spacing-7" />
      {children}
    </OakLI>
  );
}

const RegistrationAside = ({ useNew }: { useNew: boolean }) => {
  return useNew ? (
    <OakFlex
      $flexDirection="column"
      $maxWidth="all-spacing-21"
      $background="bg-decorative1-main"
      $gap="space-between-l"
    >
      <OakFlex $flexDirection="column" $gap="space-between-m2">
        <OakBox
          $mb="space-between-m2"
          $maxHeight="all-spacing-19"
          $maxWidth="all-spacing-17"
        >
          <CMSImage
            image={getIllustrationAsset("auth-acorn")}
            $objectFit="contain"
          />
        </OakBox>
        <OakFlex $flexDirection="column" $position="relative">
          <OakHeading tag="h1" $font="heading-4">
            Our resources will
          </OakHeading>
          <OakBox $zIndex="in-front">
            <OakHeading tag="h1" $font="heading-4">
              always be free.
            </OakHeading>
          </OakBox>
          <OakSvg
            name="scribble"
            $position="absolute"
            $bottom="all-spacing-0"
            $height="all-spacing-8"
            $transform="scaleX(1.05)"
            $left="all-spacing-1"
          />
        </OakFlex>
        <OakFlex $flexDirection="column" $gap="space-between-s">
          <OakHeading tag="h2" $font="heading-6">
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
  ) : (
    <OakBox
      $width="min-content"
      $minWidth="all-spacing-21"
      $mb="space-between-xl"
    >
      <OakFlex $mb="space-between-m2" $maxHeight="all-spacing-19">
        <CMSImage
          image={getIllustrationAsset("auth-acorn")}
          $objectFit="contain"
        />
      </OakFlex>
      <OakHeading
        tag="h1"
        $font="heading-5"
        $mb="space-between-l"
        $textAlign="center"
      >
        Our resources will always be free. Creating an account gives you:
      </OakHeading>
      <OakUL $font="heading-light-7" $reset $mh="space-between-xl">
        <ListItem>Full unit downloads</ListItem>
        <ListItem>Instant access to Aila, our AI lesson assistant</ListItem>
        <ListItem>Priority access to new products and features</ListItem>
      </OakUL>
    </OakBox>
  );
};

export default RegistrationAside;
