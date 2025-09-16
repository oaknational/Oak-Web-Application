/* istanbul ignore file */
"use client";

import { SignIn } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import {
  OakBox,
  OakFlex,
  OakInlineBanner,
  OakLink,
  OakP,
} from "@oaknational/oak-components";
import { useRouter } from "next/navigation";

import { formAppearanceStyles } from "../../formAppearanceStyles";

import RegistrationAside from "@/components/TeacherComponents/RegistrationAside/RegistrationAside";
import RegistrationLayout from "@/components/TeacherComponents/RegistrationLayout/RegistrationLayout";
import { resolveOakHref } from "@/common-lib/urls";

const TermsAndConditions = () => {
  return (
    <OakBox $ph={"inner-padding-xl3"}>
      <OakP $font="body-2" color="text-primary" $textAlign={"left"}>
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

const Banner = () => {
  return (
    <OakInlineBanner
      isOpen
      $background="bg-decorative1-very-subdued"
      $ba="border-solid-none"
      message={
        <OakFlex $flexDirection="column">
          <OakP $font="body-3">
            <OakLink
              href={resolveOakHref({ page: "pupil-year-index" })}
              aria-label="Pupil year index"
            >
              Pupils can learn
            </OakLink>{" "}
            without signing up.
          </OakP>
          <OakP $font="body-3">Signups are for teachers and educators.</OakP>
        </OakFlex>
      }
    />
  );
};

const useClerkFormDetection = () => {
  const [formRendered, setFormRendered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkForForm = () => {
      const hasForm = document.querySelector(".cl-formButtonPrimary");
      setFormRendered(!!hasForm);
    };

    const hasClerkElements = (element: Element) =>
      element.matches?.(".cl-formButtonPrimary") ||
      element.querySelector?.(".cl-formButtonPrimary");

    const checkNodes = (nodes: NodeList) =>
      Array.from(nodes).some(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE &&
          hasClerkElements(node as Element),
      );

    // Initial check
    checkForForm();

    // Watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      if (
        mutations.some(
          (m) => checkNodes(m.addedNodes) || checkNodes(m.removedNodes),
        )
      ) {
        checkForForm();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Fallback polling for slow-loading forms
    const intervalId = setInterval(checkForForm, 100);
    const timeoutId = setTimeout(() => clearInterval(intervalId), 5000);

    return () => {
      observer.disconnect();
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [router]);

  return formRendered;
};

function SignInOrUpPage() {
  // Only show the banner and T's & C's when there is a submit button
  const formRendered = useClerkFormDetection();

  return (
    <RegistrationLayout
      termsSlot={formRendered ? <TermsAndConditions /> : null}
      asideSlot={<RegistrationAside />}
      bannerSlot={formRendered ? <Banner /> : null}
    >
      <SignIn withSignUp appearance={formAppearanceStyles} />
    </RegistrationLayout>
  );
}

export default SignInOrUpPage;
