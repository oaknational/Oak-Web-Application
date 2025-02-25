/* istanbul ignore file */
"use client";

import { SignUp } from "@clerk/nextjs";

import { formAppearanceStyles } from "../../formAppearanceStyles";

function SignUpPage() {
  return (
    <SignUp
      appearance={formAppearanceStyles}
      unsafeMetadata={{ owa: { lastTrackedSignInAt: null } }}
    />
  );
}

export default SignUpPage;
