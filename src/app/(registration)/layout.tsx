"use client";
import { resolveOakHref } from "@/common-lib/urls";
import CMSImage from "@/components/SharedComponents/CMSImage";
import withFeatureFlag from "@/hocs/withFeatureFlag";
import { getIllustrationAsset } from "@/image-data";
import {
  OakBox,
  OakFlex,
  OakLink,
  OakMaxWidth,
  OakP,
} from "@/styles/oakThemeApp";

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

function RegistrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <OakBox $background={["white", "bg-decorative1-main"]} $overflow="hidden">
      <OakMaxWidth
        $justifyContent="center"
        $alignItems={["center", "initial"]}
        $height="100vh"
      >
        <CMSImage
          image={getIllustrationAsset("auth-acorn")}
          $position="fixed"
          $display={["none", "block"]}
          $height="55%"
          $width="auto"
          $right={200}
        />
        <OakFlex $pl={["inner-padding-none", "inner-padding-xl8"]}>
          <OakFlex
            $flexDirection="column"
            $display={["none", "flex"]}
            $alignItems="center"
          >
            <OakBox
              $dropShadow="drop-shadow-standard"
              $borderRadius="border-radius-l"
              $width="max-content"
            >
              {children}
            </OakBox>
            <TermsAndConditions />
          </OakFlex>
          <OakFlex
            $flexDirection="column"
            $alignItems="center"
            $display={["flex", "none"]}
            $gap="space-between-m"
          >
            {children}
            <TermsAndConditions />
          </OakFlex>
        </OakFlex>
      </OakMaxWidth>
    </OakBox>
  );
}

const RegistrationLayoutWithFF = withFeatureFlag(
  RegistrationLayout,
  "use-auth-owa",
);

export default RegistrationLayoutWithFF;
