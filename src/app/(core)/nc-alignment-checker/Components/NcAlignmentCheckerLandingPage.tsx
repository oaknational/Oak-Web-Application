"use client";
import { OakBox, OakCodeRenderer, OakFlex } from "@oaknational/oak-components";
import { Fragment } from "react";

import {
  NcAlignmentCheckerLandingPage as CmsNcAlignmentCheckerLandingPage,
  NcAlignmentCheckerLandingPageBlock,
  NcAlignmentCheckerLandingPageBlockType,
} from "@/common-lib/cms-types/ncAlignmentChecker";
import NcAlignmentCheckerLandingPageHeader from "@/components/NcAlignmentChecker/LandingPageHeader";
import ImageTextSplitSection from "@/components/GenericPagesComponents/ImageTextSplitSection";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";

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
  NcAlignmentCheckerLandingPageTextAndMedia: ImageTextSplitSection,
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
    <OakBox $zIndex={"neutral"} $color={"text-primary"}>
      <OakFlex
        $flexDirection="column"
        $gap={["spacing-56", "spacing-80", "spacing-80"]}
      >
        {pageData.blocks?.map((block) => {
          return <Fragment key={block._key}>{renderBlock(block)}</Fragment>;
        })}
      </OakFlex>
    </OakBox>
  );
}
