"use client";
import { OakBox, OakCodeRenderer } from "@oaknational/oak-components";
import { Fragment } from "react";

import {
  NcAlignmentCheckerLandingPage,
  NcAlignmentCheckerLandingPageBlock,
  NcAlignmentCheckerLandingPageBlockType,
} from "@/common-lib/cms-types/ncAlignmentChecker";
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
  NcAlignmentCheckerLandingPageHeader: DefaultComponent,
  NcAlignmentCheckerLandingPageTextAndMedia: DefaultComponent,
  NcAlignmentCheckerLandingPageSubjectExperts: DefaultComponent,
  NcAlignmentCheckerLandingPageQuotes: DefaultComponent,
  NcAlignmentCheckerLandingPageFaqs: DefaultComponent,
  NcAlignmentCheckerLandingPageSubjectPickerCallout: DefaultComponent,
};

function renderBlock<K extends NcAlignmentCheckerLandingPageBlockType>(
  block: NcAlignmentCheckerLandingPageBlock<K>,
) {
  return pageComponents[block.__typename](block);
}

export function NcAlignmentCheckerPage({
  pageData,
}: Readonly<{
  pageData: NcAlignmentCheckerLandingPage;
}>) {
  return (
    <OakBox $zIndex={"neutral"} $color={"text-primary"}>
      {pageData.blocks?.map((block) => {
        return <Fragment key={block._key}>{renderBlock(block)}</Fragment>;
      })}
    </OakBox>
  );
}
