/* istanbul ignore file */
"use client";

import { SignIn } from "@clerk/nextjs";
import { OakBox } from "@oaknational/oak-components";
import { useSearchParams } from "next/navigation";

import { formAppearanceStyles } from "../../formAppearanceStyles";

import CMSImage from "@/components/SharedComponents/CMSImage";
import RegistrationLayout from "@/components/TeacherComponents/RegistrationLayout/RegistrationLayout";
import { getIllustrationAsset } from "@/image-data";

function SignInPage() {
  let signUpForceRedirectUrl: string | undefined = undefined;
  const searchParams = useSearchParams();
  if (searchParams) {
    signUpForceRedirectUrl = searchParams.get(
      "sign_up_force_redirect_url",
    ) as string;
  }
  console.log(signUpForceRedirectUrl);
  return (
    <RegistrationLayout
      asideSlot={
        <OakBox $maxHeight="all-spacing-21">
          <CMSImage
            image={getIllustrationAsset("auth-acorn")}
            $height="100%"
            $objectFit="contain"
          />
        </OakBox>
      }
    >
      <SignIn
        signUpForceRedirectUrl={signUpForceRedirectUrl}
        appearance={formAppearanceStyles}
      />
    </RegistrationLayout>
  );
}

export default SignInPage;
