import { SignUpButton } from "@clerk/nextjs";
import {
  OakIconName,
  OakLink,
  OakLinkProps,
} from "@oaknational/oak-components";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { resolveOakHref } from "@/common-lib/urls";
import { useComplexCopyright } from "@/hooks/useComplexCopyright";

type LinkState =
  | "loading"
  | "action"
  | "onboarding"
  | "signup"
  | "georestricted"
  | "null";

type ActionProps = {
  href: string;
  name: string;
  iconName?: OakIconName;
  isTrailingIcon?: boolean;
};

type SignUpProps = {
  name?: string;
  iconName?: OakIconName;
  isTrailingIcon?: boolean;
  showNewTag?: boolean;
};

type OnboardingProps = {
  name: string;
};

type BaseProps = {
  geoRestricted: boolean;
  loginRequired: boolean;
  variant?: "primary" | "secondary";
  actionProps?: ActionProps;
  signUpProps?: SignUpProps;
  onboardingProps?: OnboardingProps;
};

type LoginRequiredLinkProps = BaseProps & OakLinkProps;

const LoginRequiredLink = (props: LoginRequiredLinkProps) => {
  const {
    actionProps,
    signUpProps,
    onboardingProps,
    loginRequired,
    geoRestricted,
    variant = "primary",
    ...overrideProps
  } = props;
  const pathName = usePathname();
  const {
    showSignedInNotOnboarded,
    showSignedOutGeoRestricted,
    showSignedOutLoginRequired,
    showGeoBlocked,
    isLoaded,
  } = useComplexCopyright({ loginRequired, geoRestricted });

  const contentRestricted = loginRequired || geoRestricted;
  const linkState = useMemo((): LinkState => {
    if (contentRestricted && !isLoaded) {
      return "loading";
    } else if (showSignedOutGeoRestricted || showSignedOutLoginRequired) {
      return "signup";
    } else if (showSignedInNotOnboarded) {
      return "onboarding";
    } else if (actionProps) {
      if (showGeoBlocked) {
        return "georestricted";
      }
      return "action";
    } else {
      return "null";
    }
  }, [
    contentRestricted,
    isLoaded,
    showSignedOutGeoRestricted,
    showSignedOutLoginRequired,
    showSignedInNotOnboarded,
    actionProps,
    showGeoBlocked,
  ]);

  switch (linkState) {
    case "onboarding":
      return (
        <OakLink
          type={variant}
          href={
            resolveOakHref({ page: "onboarding" }) + `?returnTo=${pathName}`
          }
          {...overrideProps}
        >
          {onboardingProps?.name ?? "Complete sign up to continue"}
        </OakLink>
      );
    case "signup":
      return (
        <SignUpButton forceRedirectUrl={`/onboarding?returnTo=${pathName}`}>
          <OakLink {...overrideProps} type={variant} href={"#"}>
            {signUpProps?.name ?? "Sign up"}
          </OakLink>
        </SignUpButton>
      );
    case "action":
    case "georestricted":
      return (
        <OakLink
          type={variant}
          href={actionProps?.href}
          aria-disabled={linkState === "georestricted"}
          {...overrideProps}
        >
          {actionProps?.name}
        </OakLink>
      );
    case "loading":
      return (
        <OakLink
          {...overrideProps}
          type={variant}
          aria-disabled="true"
          aria-busy="true"
        >
          {actionProps?.name}
        </OakLink>
      );
    default:
      return null;
  }
};

export default LoginRequiredLink;
