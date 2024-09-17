/* istanbul ignore file */
"use client";

import { SignUp } from "@clerk/nextjs";

import { formAppearanceStyles } from "../../formAppearanceStyles";

export default function SignUpPage() {
  return <SignUp appearance={formAppearanceStyles} />;
}
