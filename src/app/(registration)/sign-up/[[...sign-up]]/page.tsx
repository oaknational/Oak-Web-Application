/* istanbul ignore file */
"use client";

import { SignUp } from "@clerk/nextjs";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakIcon,
  OakInlineBanner,
  OakLI,
  OakUL,
} from "@oaknational/oak-components";
import { PropsWithChildren } from "react";

import { formAppearanceStyles } from "../../formAppearanceStyles";
import { AuthLayout } from "../../auth-layout";

import { getIllustrationAsset } from "@/image-data";
import CMSImage from "@/components/SharedComponents/CMSImage";

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

function SignUpPage() {
  return (
    <AuthLayout
      headerSlot={
        <OakInlineBanner
          isOpen
          message={
            <>
              No <strong>pupil accounts</strong>, sorry.
            </>
          }
          $mt={["space-between-m", "space-between-none"]}
          $mb={["space-between-none", "space-between-m"]}
        />
      }
      asideSlot={
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
      }
    >
      <SignUp
        appearance={formAppearanceStyles}
        unsafeMetadata={{ owa: { lastTrackedSignInAt: null } }}
      />
    </AuthLayout>
  );
}

export default SignUpPage;
