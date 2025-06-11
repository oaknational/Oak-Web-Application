import { SignUpButton } from "@clerk/nextjs";
import { OakPrimaryButton } from "@oaknational/oak-components";
import { useRouter } from "next/router";

const OakSignUpButton = () => {
  const router = useRouter();

  return (
    <SignUpButton forceRedirectUrl={`/onboarding?returnTo=${router.asPath}`}>
      <OakPrimaryButton>Sign up</OakPrimaryButton>
    </SignUpButton>
  );
};

export default OakSignUpButton;
