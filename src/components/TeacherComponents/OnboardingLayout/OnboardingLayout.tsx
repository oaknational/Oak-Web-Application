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
      $background={["bg-primary", "bg-decorative1-main"]}
      $overflow="auto"
      $color="text-primary"
    >
      <OakFlex
        $justifyContent={"center"}
        $minHeight={"100vh"}
        $alignItems={["flex-start", "center"]}
        $flexDirection="row"
        $pv={["spacing-0", "spacing-40"]}
        $maxWidth={["spacing-480", "spacing-1280"]}
        $ph={["spacing-0", "spacing-12"]}
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
            $minWidth="spacing-480"
            $mb="spacing-56"
          >
            <OakFlex $mb="spacing-24" $maxHeight="spacing-240">
              <CMSImage
                image={getIllustrationAsset("auth-acorn")}
                $objectFit="contain"
              />
            </OakFlex>
            <OakHeading tag="h1" $font="heading-1" $mb="spacing-24">
              {promptHeading}
            </OakHeading>
            <OakBox
              $display="inline-flex"
              $font="body-1"
              $maxWidth="spacing-360"
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
              $mb={["spacing-0", "spacing-24"]}
              $width="100%"
            >
              {children}
            </OakBox>
            <OakBox
              as="p"
              $font="body-2"
              color="text-primary"
              $textAlign="center"
              $pb="spacing-12"
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
