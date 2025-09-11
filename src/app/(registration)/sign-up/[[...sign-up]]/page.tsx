/* istanbul ignore file */
"use client";

import { SignUp } from "@clerk/nextjs";
import { useState, useCallback, useEffect } from "react";
import {
  OakBox,
  OakFlex,
  OakInlineBanner,
  OakLink,
  OakP,
} from "@oaknational/oak-components";
import { useSearchParams } from "next/navigation";

import { formAppearanceStyles } from "../../formAppearanceStyles";

import RegistrationAside from "@/components/TeacherComponents/RegistrationAside/RegistrationAside";
import RegistrationLayout from "@/components/TeacherComponents/RegistrationLayout/RegistrationLayout";
import { resolveOakHref } from "@/common-lib/urls";

const TermsAndConditions = () => {
  return (
    <OakBox $ph={"inner-padding-xl3"}>
      <OakP $font="body-2" color="text-primary" $textAlign={"left"}>
        By continuing you are agreeing to Oak's{" "}
        <OakLink
          href={resolveOakHref({
            page: "legal",
            legalSlug: "terms-and-conditions",
          })}
          target="_blank"
          aria-label="Terms and conditions (opens in a new tab)"
        >
          terms & conditions
        </OakLink>{" "}
        and{" "}
        <OakLink
          href={resolveOakHref({
            page: "legal",
            legalSlug: "privacy-policy",
          })}
          target="_blank"
          aria-label="Privacy policy (opens in a new tab)"
        >
          privacy policy
        </OakLink>
        .
      </OakP>
    </OakBox>
  );
};

const Banner = () => {
  return (
    <OakInlineBanner
      isOpen
      $background="bg-decorative1-very-subdued"
      $ba="border-solid-none"
      message={
        <OakFlex $flexDirection="column">
          <OakP $font="body-3">
            <OakLink
              href={resolveOakHref({ page: "pupil-year-index" })}
              aria-label="Pupil year index"
            >
              Pupils can learn
            </OakLink>{" "}
            without signing up.
          </OakP>
          <OakP $font="body-3">Signups are for teachers and educators.</OakP>
        </OakFlex>
      }
    />
  );
};

function SignUpPage() {
  const [clerkRendered, setClerkRendered] = useState(false);
  let signUpForceRedirectUrl: string | undefined = undefined;
  const searchParams = useSearchParams();
  if (searchParams) {
    signUpForceRedirectUrl = searchParams.get(
      "sign_up_force_redirect_url",
    ) as string;
  }
  const checkForClerkElement = useCallback(() => {
    // Clerk docs say these classnames are stable
    const clerkSignUpElement = document.getElementsByClassName(
      "cl-rootBox cl-signUp-root",
    )[0];
    const clerkSignInElement = document.getElementsByClassName(
      "cl-rootBox cl-signIn-root",
    )[0];
    if (clerkSignUpElement || clerkSignInElement) {
      setClerkRendered(true);
    } else {
      setTimeout(() => checkForClerkElement(), 100);
    }
  }, []);

  useEffect(() => {
    checkForClerkElement();
  }, [checkForClerkElement]);
  console.log(signUpForceRedirectUrl);
  return (
    <RegistrationLayout
      termsSlot={clerkRendered ? <TermsAndConditions /> : null}
      asideSlot={<RegistrationAside />}
      bannerSlot={clerkRendered ? <Banner /> : null}
    >
      <SignUp
        signInForceRedirectUrl={signUpForceRedirectUrl}
        appearance={formAppearanceStyles}
        unsafeMetadata={{ owa: { lastTrackedSignInAt: null } }}
      />
    </RegistrationLayout>
  );
}

export default SignUpPage;
