import {
  OakFlex,
  OakFocusIndicator,
  type OakAllSpacingToken,
} from "@oaknational/oak-components";
import Link from "next/link";
import type { ReactNode } from "react";

export const CurriculumJumpCard = ({
  minHeight = "spacing-120",
  href,
  children,
}: {
  minHeight?: OakAllSpacingToken;
  href: string;
  children: ReactNode;
}) => (
  <OakFocusIndicator
    $width="100%"
    $background="bg-primary"
    $borderRadius="border-radius-m2"
    $hoverBackground="bg-neutral"
  >
    <OakFlex
      as={Link}
      href={href}
      $alignItems="center"
      $gap="spacing-16"
      $width="100%"
      $minHeight={minHeight}
      $pa="spacing-16"
      $ba="border-solid-s"
      $borderColor="border-neutral-lighter"
      $borderRadius="border-radius-m2"
      $color="text-primary"
      $textDecoration="none"
    >
      {children}
    </OakFlex>
  </OakFocusIndicator>
);
