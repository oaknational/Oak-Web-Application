/* istanbul ignore file */
"use client";

import { SignIn } from "@clerk/nextjs";
import { OakBox } from "@oaknational/oak-components";

import { formAppearanceStyles } from "../../formAppearanceStyles";

import CMSImage from "@/components/SharedComponents/CMSImage";
import { RegistrationLayout } from "@/components/TeacherComponents/RegistrationLayout/RegistrationLayout";
import { getIllustrationAsset } from "@/image-data";

function SignInPage() {
  return (
    <RegistrationLayout
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
    </RegistrationLayout>
  );
}

export default SignInPage;
