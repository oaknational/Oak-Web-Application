import { SignUpButton } from "@clerk/nextjs";
import {
  OakIconName,
  OakLink,
  OakLinkProps,
  OakSecondaryLink,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";

import { resolveOakHref } from "@/common-lib/urls";
import { useLoginRequiredState } from "@/hooks/useLoginRequiredState";

export type ActionProps = {
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

type LinkVariant = "primary" | "secondary";

type BaseProps = {
  geoRestricted: boolean;
  loginRequired: boolean;
  variant?: "primary" | "secondary";
  actionProps?: ActionProps;
  signUpProps?: SignUpProps;
  onboardingProps?: OnboardingProps;
};

type LoginRequiredLinkProps = BaseProps & OakLinkProps;

const getLinkVariant = (variant: LinkVariant) => {
  return variant === "primary" ? OakLink : OakSecondaryLink;
};

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
  const router = useRouter();

  const { state: linkState } = useLoginRequiredState({
    geoRestricted,
    loginRequired,
    hasActionProps: !!actionProps,
  });

  const LinkVariant = getLinkVariant(variant);

  switch (linkState) {
    case "onboarding":
      return (
        <LinkVariant
          href={
            resolveOakHref({ page: "onboarding" }) +
            `?returnTo=${router.asPath}`
          }
          {...overrideProps}
        >
          {onboardingProps?.name ?? "Complete sign up to continue"}
        </LinkVariant>
      );
    case "signup":
      return (
        <SignUpButton
          forceRedirectUrl={`/onboarding?returnTo=${router.asPath}`}
        >
          <LinkVariant {...overrideProps} href={"#"}>
            {signUpProps?.name ?? "Sign up"}
          </LinkVariant>
        </SignUpButton>
      );
    case "action":
    case "georestricted":
      return (
        <LinkVariant
          href={actionProps?.href}
          aria-disabled={linkState === "georestricted"}
          {...overrideProps}
        >
          {actionProps?.name}
        </LinkVariant>
      );
    case "loading":
      return (
        <LinkVariant {...overrideProps} aria-disabled="true" aria-busy="true">
          {actionProps?.name}
        </LinkVariant>
      );
    default:
      return null;
  }
};

export default LoginRequiredLink;
