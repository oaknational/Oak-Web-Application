"use client";
import AppHeader from "@/components/AppComponents/AppHeader";
import LayoutSiteFooter from "@/components/AppComponents/LayoutSiteFooter";
import SkipLink from "@/components/CurriculumComponents/OakComponentsKitchen/SkipLink";
import { OakBox, OakFlex } from "@oaknational/oak-components";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <OakFlex $flexDirection="column" $flexGrow={1}>
      <OakBox
        $position={"absolute"}
        $height={"all-spacing-13"}
        $width={"all-spacing-11"}
        $zIndex={"in-front"}
        $top={"all-spacing-14"}
        $left={"all-spacing-6"}
      >
        <SkipLink href="#main">Skip to content</SkipLink>
      </OakBox>
      <AppHeader />
      <OakFlex
        $flexDirection="column"
        $flexGrow={1}
        $width="100%"
        as="main"
        id="main"
      >
        {children}
      </OakFlex>
      <LayoutSiteFooter />
      {/* {isPreview && <LayoutPreviewControls />} */}
    </OakFlex>
  );
}
