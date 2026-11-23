"use client";
import { OakFlex, OakCodeRenderer } from "@oaknational/oak-components";
import { Fragment } from "react";

import {
  NcAlignmentCheckerLandingPage as CmsNcAlignmentCheckerLandingPage,
  NcAlignmentCheckerLandingPageBlock,
  NcAlignmentCheckerLandingPageBlockType,
} from "@/common-lib/cms-types/ncAlignmentChecker";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import NcAlignmentCheckerLandingPageHeader from "@/components/NcAlignmentChecker/LandingPageHeader";
import FaqsSection from "@/components/GenericPagesComponents/FaqsSection";

function DefaultComponent(
  block: NcAlignmentCheckerLandingPageBlock<NcAlignmentCheckerLandingPageBlockType>,
) {
  return (
    <NewGutterMaxWidth>
      <OakCodeRenderer
        string={"```" + JSON.stringify(block, null, 2) + "```"}
      />
    </NewGutterMaxWidth>
  );
}

const pageComponents: {
  [K in NcAlignmentCheckerLandingPageBlockType]: (
    props: NcAlignmentCheckerLandingPageBlock<K>,
  ) => React.ReactNode;
} = {
  NcAlignmentCheckerLandingPageHeader: NcAlignmentCheckerLandingPageHeader,
  NcAlignmentCheckerLandingPageTextAndMedia: DefaultComponent,
  NcAlignmentCheckerLandingPageSubjectExperts: DefaultComponent,
  NcAlignmentCheckerLandingPageQuotes: DefaultComponent,
  NcAlignmentCheckerLandingPageFaqs: FaqsSection,
  NcAlignmentCheckerLandingPageSubjectPickerCallout: DefaultComponent,
};

function renderBlock<K extends NcAlignmentCheckerLandingPageBlockType>(
  block: NcAlignmentCheckerLandingPageBlock<K>,
) {
  return pageComponents[block.__typename](block);
}

export function NcAlignmentCheckerLandingPage({
  pageData,
}: Readonly<{
  pageData: CmsNcAlignmentCheckerLandingPage;
}>) {
  return (
    <OakFlex
      $zIndex={"neutral"}
      $color={"text-primary"}
      $gap={["spacing-56", "spacing-80", "spacing-100"]}
      $flexDirection="column"
    >
      {pageData.blocks?.map((block) => {
        return <Fragment key={block._key}>{renderBlock(block)}</Fragment>;
      })}
    </OakFlex>
  );
}
