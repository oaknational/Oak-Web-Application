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
  let signInForceRedirectUrl: string | undefined = undefined;
  const searchParams = useSearchParams();
  if (searchParams) {
    signInForceRedirectUrl = searchParams.get(
      "sign_in_force_redirect_url",
    ) as string;
  }
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
        signUpForceRedirectUrl={signInForceRedirectUrl}
        appearance={formAppearanceStyles}
      />
    </RegistrationLayout>
  );
}

export default SignInPage;
