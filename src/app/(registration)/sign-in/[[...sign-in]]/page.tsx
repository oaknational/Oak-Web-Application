/* istanbul ignore file */
"use client";

import { SignIn } from "@clerk/nextjs";
import { OakBox } from "@oaknational/oak-components";

import { formAppearanceStyles } from "../../formAppearanceStyles";
import { AuthLayout } from "../../auth-layout";

import { getIllustrationAsset } from "@/image-data";
import CMSImage from "@/components/SharedComponents/CMSImage";
import withFeatureFlag from "@/hocs/withFeatureFlag";

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

const SigninPageWithFeatureFlag = withFeatureFlag(
  SignInPage,
  "teacher-download-auth",
  "with-login",
);

export default SigninPageWithFeatureFlag;
