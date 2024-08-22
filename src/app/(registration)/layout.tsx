"use client";
import { resolveOakHref } from "@/common-lib/urls";
import CMSImage from "@/components/SharedComponents/CMSImage";
import { RegistrationLayout } from "@/components/TeacherComponents/RegistrationLayout/RegistrationLayout";
import withFeatureFlag from "@/hocs/withFeatureFlag";
import { getIllustrationAsset } from "@/image-data";
import { OakBox, OakFlex, OakLink, OakP } from "@/styles/oakThemeApp";

const TermsAndConditions = () => {
  return (
    <OakBox $maxWidth="all-spacing-20">
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
        >
          {children}
        </OakBox>
        <TermsAndConditions />
      </OakBox>
      <OakFlex
        $flexDirection="column"
        $alignItems="center"
        $display={["flex", "none"]}
        $gap="space-between-m"
      >
        {children}
        <TermsAndConditions />
      </OakFlex>
    </RegistrationLayout>
  );
}

const LayoutWithFF = withFeatureFlag(Layout, "use-auth-owa");

export default LayoutWithFF;
