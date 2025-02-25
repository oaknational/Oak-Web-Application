/* istanbul ignore file */
"use client";

import { SignUp } from "@clerk/nextjs";
import { OakInlineBanner } from "@oaknational/oak-components";

import { formAppearanceStyles } from "../../formAppearanceStyles";
import { AuthLayout } from "../../auth-layout";

import RegistrationAside from "@/components/TeacherComponents/RegistrationAside/ResgistrationAside";

function SignUpPage() {
  return (
    <AuthLayout
      bannerSlot={
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
      asideSlot={<RegistrationAside />}
    >
      <SignUp
        appearance={formAppearanceStyles}
        unsafeMetadata={{ owa: { lastTrackedSignInAt: null } }}
      />
    </AuthLayout>
  );
}

export default SignUpPage;
