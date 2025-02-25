import {
  OakBox,
  OakFlex,
  OakHeading,
  OakIcon,
  OakLI,
  OakUL,
} from "@oaknational/oak-components";
import { PropsWithChildren } from "react";

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

const RegistrationAside = () => {
  return (
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
