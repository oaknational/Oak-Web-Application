/* istanbul ignore file */
"use client";

import { SignIn } from "@clerk/nextjs";

import { formAppearanceStyles } from "../../formAppearanceStyles";

export default function SignInPage() {
  return <SignIn appearance={formAppearanceStyles} />;
}
