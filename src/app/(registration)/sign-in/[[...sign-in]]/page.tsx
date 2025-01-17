/* istanbul ignore file */
"use client";

import { SignIn } from "@clerk/nextjs";
import { OakBox } from "@oaknational/oak-components";

import { formAppearanceStyles } from "../../formAppearanceStyles";
import { AuthLayout } from "../../auth-layout";

import { getIllustrationAsset } from "@/image-data";
import CMSImage from "@/components/SharedComponents/CMSImage";

function SignInPage() {
  return (
    <AuthLayout
      asideSlot={
        <OakBox $maxWidth="all-spacing-21">
          <CMSImage
            image={getIllustrationAsset("auth-acorn")}
            $width="100%"
            $objectFit="contain"
          />
        </OakBox>
      }
    >
      <SignIn appearance={formAppearanceStyles} />
    </AuthLayout>
  );
}

export default SignInPage;
