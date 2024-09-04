"use client";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { resolveOakHref } from "@/common-lib/urls";
import CMSImage from "@/components/SharedComponents/CMSImage";
import { RegistrationLayout } from "@/components/TeacherComponents/RegistrationLayout/RegistrationLayout";
import withFeatureFlag from "@/hocs/withFeatureFlag";
import { getIllustrationAsset } from "@/image-data";
import { OakBox, OakFlex, OakLink, OakP } from "@/styles/oakThemeApp";

export const TermsAndConditions = () => {
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

function Layout({ children }: { children: React.ReactNode }) {
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
    <RegistrationLayout
      asideSlot={
        <OakBox $maxWidth="all-spacing-21">
          <CMSImage
            image={getIllustrationAsset("auth-acorn")}
            $width="100%"
            $objectFit="contain"
          />
        </OakBox>
      }
    >
      <OakBox $display={["none", "block"]}>
        <OakBox
          $dropShadow="drop-shadow-standard"
          $borderRadius="border-radius-m2"
          $width="max-content"
          $mb="space-between-m"
          ref={clerkRef}
        >
          {children}
        </OakBox>
        {clerkRendered && <TermsAndConditions />}
      </OakBox>
      <OakFlex
        $flexDirection="column"
        $alignItems="center"
        $display={["flex", "none"]}
        $gap="space-between-m"
      >
        {children}
        {clerkRendered && <TermsAndConditions />}
      </OakFlex>
    </RegistrationLayout>
  );
}

const LayoutWithFF = withFeatureFlag(Layout, "use-auth-owa");

export default LayoutWithFF;
