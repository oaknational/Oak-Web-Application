import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakMaxWidth,
  OakP,
  OakPrimaryButton,
  OakSmallTertiaryInvertedButton,
  parseSpacing,
} from "@oaknational/oak-components";
import styled from "styled-components";

import LessonOverviewPresentation from "@/components/TeacherComponents/LessonOverviewPresentation";

export const ShortReads = () => {
  return (
    <OakBox $background="bg-decorative2-very-subdued" $width="100%">
      <OakMaxWidth
        $flexDirection="column"
        $alignItems="flex-start"
        $pv={["spacing-56", "spacing-80"]}
        $ph={["spacing-20", "spacing-40"]}
        $gap="spacing-56"
      >
        <ShortReadsHeader />
        <ShortReadSection
          title="Explanation at Oak"
          description="This short guide explores Oak’s approach to explanation and the
              thinking behind our design, helping you deepen your understanding
              and support your teaching."
          assetUrl={"1Wc5TYGrmX3z6pvJWORXVyg_Hlu8NsfMTL6xoTb_UbFM"}
          shortReadType="explanation"
          isInitiallyVisible
        />
        <ShortReadSection
          title="Check for understanding (CfU) at Oak"
          description="This short guide explores Oak’s approach to CfUs and the thinking behind our design, helping you deepen your understanding and support your teaching."
          assetUrl={"1Wc5TYGrmX3z6pvJWORXVyg_Hlu8NsfMTL6xoTb_UbFM"}
          shortReadType="CfU"
        />
        <ShortReadSection
          title="Practice at Oak"
          description="This short guide explores Oak’s approach to practice and the thinking behind our design, helping you deepen your understanding and support your teaching. "
          assetUrl={"1Wc5TYGrmX3z6pvJWORXVyg_Hlu8NsfMTL6xoTb_UbFM"}
          shortReadType="practice"
        />
        <ShortReadSection
          title="Feedback at Oak"
          description="This short guide explores Oak’s approach to feedback and the thinking behind our design, helping you deepen your understanding and support your teaching.  "
          assetUrl={"1Wc5TYGrmX3z6pvJWORXVyg_Hlu8NsfMTL6xoTb_UbFM"}
          shortReadType="feedback"
        />
      </OakMaxWidth>
    </OakBox>
  );
};

const ShortReadsHeader = () => {
  return (
    <OakGrid $rg={["spacing-16", "spacing-16", "spacing-8"]}>
      <OakGridArea $colSpan={[12, 12, 8]} $order={1}>
        <OakHeading $font={["heading-4", "heading-3"]} tag="h2">
          Short read guides
        </OakHeading>
      </OakGridArea>
      <OakGridArea
        $colSpan={[12, 12, 4]}
        $colStart={[1, 1, 9]}
        $alignItems={["flex-start", "flex-start", "flex-end"]}
        $order={[3, 3, 1]}
      >
        <OakBox $pt={["spacing-8", "spacing-8", "spacing-0"]}>
          <OakPrimaryButton
            iconName="download"
            isTrailingIcon
            aria-label="Opens in a new tab"
          >
            Download all guides
          </OakPrimaryButton>
        </OakBox>
      </OakGridArea>
      <OakGridArea $colSpan={[12, 12, 8]} $order={[2, 2, 1]}>
        <OakP>
          Download the four short reads below to see the thinking behind each,
          how they work together and how you might adapt and build on them for
          your pupils.
        </OakP>
      </OakGridArea>
    </OakGrid>
  );
};

const ShortReadDownloadButton = styled(OakSmallTertiaryInvertedButton)`
  div {
    padding-left: ${parseSpacing("spacing-0")};
  }
`;

const ShortReadSection = ({
  title,
  description,
  shortReadType,
  assetUrl,
  isInitiallyVisible = false,
}: {
  title: string;
  description: string;
  shortReadType: string;
  assetUrl: string;
  isInitiallyVisible?: boolean;
}) => {
  return (
    <OakFlex $flexDirection="column" $gap="spacing-24">
      <OakGrid $rg="spacing-8">
        <OakGridArea $colSpan={[12, 12, 8]} $order={1}>
          <OakHeading $font={["heading-5", "heading-4"]} tag="h3">
            {title}
          </OakHeading>
        </OakGridArea>
        <OakGridArea
          $colSpan={[12, 12, 4]}
          $colStart={[1, 1, 9]}
          $alignItems={["flex-start", "flex-start", "flex-end"]}
          $order={[2, 3, 1]}
        >
          <OakBox $pt="spacing-16">
            <ShortReadDownloadButton
              iconName="download"
              isTrailingIcon
              aria-label="Opens in a new tab"
            >
              {`Download ${shortReadType} guide (PDF)`}
            </ShortReadDownloadButton>
          </OakBox>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 12, 8]} $order={[3, 2, 1]}>
          <OakP>{description}</OakP>
        </OakGridArea>
      </OakGrid>
      <LessonOverviewPresentation
        asset={assetUrl}
        title={title}
        isWorksheet
        loading={isInitiallyVisible ? "eager" : "lazy"}
      />
    </OakFlex>
  );
};
