/* istanbul ignore file */
"use client";

import { SignIn } from "@clerk/nextjs";

import { formAppearanceStyles } from "../../formAppearanceStyles";

function SignInPage() {
  return <SignIn appearance={formAppearanceStyles} />;
}

export default SignInPage;
