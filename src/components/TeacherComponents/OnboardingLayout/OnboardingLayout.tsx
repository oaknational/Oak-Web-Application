import {
  OakBox,
  OakFlex,
  OakHeading,
  OakLink,
} from "@oaknational/oak-components";
import { PropsWithChildren, ReactNode } from "react";

import CMSImage from "@/components/SharedComponents/CMSImage";
import { getIllustrationAsset } from "@/image-data";
import RegistrationLayout from "@/components/TeacherComponents/RegistrationLayout/RegistrationLayout";
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
    <RegistrationLayout
      useAlternateLayout={false}
      termsSlot={
        <OakBox
          as="p"
          $font="body-2"
          color="text-primary"
          $textAlign="center"
          $pb="inner-padding-s"
          $width="max-content"
        >
          Need help?
          <OakLink
            href={resolveOakHref({
              page: "contact",
            })}
          >
            Contact us
          </OakLink>
          .
        </OakBox>
      }
      asideSlot={
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
      }
    >
      {children}
    </RegistrationLayout>
  );
};
