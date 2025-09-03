import {
  OakBox,
  OakFlex,
  OakHeading,
  OakLink,
} from "@oaknational/oak-components";
import { PropsWithChildren, ReactNode } from "react";

import CMSImage from "@/components/SharedComponents/CMSImage";
import { getIllustrationAsset } from "@/image-data";
import { resolveOakHref } from "@/common-lib/urls";

type OnboardingLayoutProps = PropsWithChildren<{
  promptHeading: ReactNode;
  promptBody: ReactNode;
}>;

export const OnboardingLayout = ({
  children,
  promptHeading,
  promptBody,
}: OnboardingLayoutProps) => {
  return (
    <OakFlex
      $background={["white", "bg-decorative1-main"]}
      $overflow="auto"
      $color="black"
    >
      <OakFlex
        $justifyContent={"center"}
        $minHeight={"100vh"}
        $alignItems={["flex-start", "center"]}
        $flexDirection="row"
        $pv={["inner-padding-none", "inner-padding-xl3"]}
        $maxWidth={["all-spacing-21", "all-spacing-24"]}
        $ph={["inner-padding-none", "inner-padding-s"]}
        $flexGrow={1}
        $width={"100%"}
        $mh={"auto"}
      >
        <OakFlex
          $display={["none", "none", "flex"]}
          $flexGrow={1}
          $justifyContent="flex-end"
          $order={2}
        >
          <OakBox
            $textAlign="center"
            $width="min-content"
            $minWidth="all-spacing-21"
            $mb="space-between-xl"
          >
            <OakFlex $mb="space-between-m" $maxHeight="all-spacing-19">
              <CMSImage
                image={getIllustrationAsset("auth-acorn")}
                $objectFit="contain"
              />
            </OakFlex>
            <OakHeading tag="h1" $font="heading-1" $mb="space-between-m">
              {promptHeading}
            </OakHeading>
            <OakBox
              $display="inline-flex"
              $font="body-1"
              $maxWidth="all-spacing-20"
            >
              {promptBody}
            </OakBox>
          </OakBox>
        </OakFlex>
        <OakFlex $display="block" $order={1} style={{ width: "400px" }}>
          <OakFlex
            $flexDirection="column"
            $alignItems="center"
            $justifyContent="center"
          >
            <OakBox
              $dropShadow={[null, "drop-shadow-standard"]}
              $borderRadius="border-radius-m2"
              $mb={["space-between-none", "space-between-m"]}
              $width="100%"
            >
              {children}
            </OakBox>
            <OakBox
              as="p"
              $font="body-2"
              color="text-primary"
              $textAlign="center"
              $pb="inner-padding-s"
              $width="max-content"
            >
              Need help?{" "}
              <OakLink
                href={resolveOakHref({
                  page: "contact",
                })}
              >
                Contact us
              </OakLink>
              .
            </OakBox>
          </OakFlex>
        </OakFlex>
      </OakFlex>
    </OakFlex>
  );
};
