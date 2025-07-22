import { SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/router";

function RedirectToSignUpWhenRestrictedWrapper({
  children,
  contentRestricted,
}: {
  children: React.ReactNode;
  contentRestricted: boolean;
}) {
  const router = useRouter();
  if (contentRestricted) {
    return (
      <SignUpButton forceRedirectUrl={router.asPath}>{children}</SignUpButton>
    );
  }

  return <>{children}</>;
}

export default RedirectToSignUpWhenRestrictedWrapper;
