"use client";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { resolveOakHref } from "@/common-lib/urls";
import { RegistrationLayout } from "@/components/TeacherComponents/RegistrationLayout/RegistrationLayout";
import withFeatureFlag from "@/hocs/withFeatureFlag";
import { OakBox, OakFlex, OakLink, OakP } from "@/styles/oakThemeApp";

const TermsAndConditions = () => {
  return (
    <OakBox>
      <OakP $font="body-2" color="text-primary" $textAlign="center">
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

function BaseAuthLayout({
  children,
  asideSlot,
}: {
  children: React.ReactNode;
  asideSlot: React.ReactNode;
}) {
  const clerkRef = useRef<null | HTMLDivElement>(null);
  const [clerkRendered, setClerkRendered] = useState(false);

  const checkForClerkElement = useCallback(
    (ref: MutableRefObject<HTMLDivElement | null>) => {
      if (ref.current) {
        // Clerk docs say these classnames are stable
        const clerkSignUpElement = ref.current.getElementsByClassName(
          "cl-rootBox cl-signUp-root",
        )[0];
        const clerkSignInElement = ref.current.getElementsByClassName(
          "cl-rootBox cl-signIn-root",
        )[0];
        if (clerkSignUpElement || clerkSignInElement) {
          setClerkRendered(true);
        } else {
          setTimeout(() => checkForClerkElement(ref), 100);
        }
      }
    },
    [],
  );

  useEffect(() => {
    checkForClerkElement(clerkRef);
  }, [clerkRef, checkForClerkElement]);

  return (
    <RegistrationLayout asideSlot={asideSlot}>
      <OakFlex
        $flexDirection="column"
        $alignItems="center"
        $gap="space-between-m"
        $display={["flex", "block"]}
      >
        <OakBox
          $dropShadow={[null, "drop-shadow-standard"]}
          $borderRadius="border-radius-m2"
          $width={["auto", "max-content"]}
          $mb={["space-between-none", "space-between-m"]}
          ref={clerkRef}
        >
          {children}
        </OakBox>
        {clerkRendered && <TermsAndConditions />}
      </OakFlex>
    </RegistrationLayout>
  );
}

export const AuthLayout = withFeatureFlag(BaseAuthLayout, "use-auth-owa");
