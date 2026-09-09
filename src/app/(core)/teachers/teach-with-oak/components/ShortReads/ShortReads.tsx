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
import { ReactNode } from "react";
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
        <Header
          title={
            <OakHeading $font={["heading-4", "heading-3"]} tag="h2">
              Short read guides
            </OakHeading>
          }
          description={
            <OakP>
              Download the four short reads below to see the thinking behind
              each, how they work together and how you might adapt and build on
              them for your pupils.
            </OakP>
          }
          downloadButton={
            <OakPrimaryButton
              iconName="download"
              isTrailingIcon
              aria-label="Opens in a new tab"
            >
              Download all guides
            </OakPrimaryButton>
          }
        />
        <ShortReadSection
          title="Explanation at oak"
          description="This short guide explores Oak’s approach to explanation and the
              thinking behind our design, helping you deepen your understanding
              and support your teaching."
          assetUrl={"1aBgV77ao7mmpRqO3m1fRvPl-958biNw0G8Rzh3ON68I"}
          shortReadType="explanation"
        />
        <ShortReadSection
          title="Check for understanding (CfU) at oak"
          description="This short guide explores Oak’s approach to CfUs and the thinking behind our design, helping you deepen your understanding and support your teaching."
          assetUrl={"1sugE2rWoa2D-JxHEQggg4FTniW8rHvazP1QtC-GtPho"}
          shortReadType="CfU"
        />
        <ShortReadSection
          title="Practice at oak"
          description="This short guide explores Oak’s approach to practice and the thinking behind our design, helping you deepen your understanding and support your teaching. "
          assetUrl={"16NK_tAod38xtV86IFnaaA0SRF6I5SohwGzb4cyKPXk8"}
          shortReadType="practice"
        />
        <ShortReadSection
          title="Feedback at oak"
          description="This short guide explores Oak’s approach to feedback and the thinking behind our design, helping you deepen your understanding and support your teaching.  "
          assetUrl={"1PR4NgNWtKLmKFWWmSlssAP7M_MtVoTpahc6MBH8lAgg"}
          shortReadType="feedback"
        />
      </OakMaxWidth>
    </OakBox>
  );
};

type HeaderProps = {
  title: ReactNode;
  description: ReactNode;
  downloadButton: ReactNode;
};

const Header = ({ title, description, downloadButton }: HeaderProps) => {
  return (
    <OakGrid $rg="spacing-8">
      <OakGridArea $colSpan={[12, 12, 8]} $order={1}>
        {title}
      </OakGridArea>
      <OakGridArea
        $colSpan={[12, 12, 4]}
        $colStart={[1, 1, 9]}
        $alignItems={["flex-start", "flex-start", "flex-end"]}
        $order={[3, 3, 1]}
        $pt={["spacing-0", "spacing-24", "spacing-0"]}
      >
        {downloadButton}
      </OakGridArea>
      <OakGridArea $colSpan={[12, 12, 8]} $order={[2, 2, 1]}>
        {description}
      </OakGridArea>
    </OakGrid>
  );
};

type ShortReadHeaderProps = {
  title: string;
  description: string;
  shortReadType: string;
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
}: ShortReadHeaderProps & { assetUrl: string }) => {
  return (
    <OakFlex $flexDirection="column" $gap="spacing-24">
      <Header
        title={
          <OakHeading $font={["heading-5", "heading-4"]} tag="h3">
            {title}
          </OakHeading>
        }
        downloadButton={
          <ShortReadDownloadButton
            iconName="download"
            isTrailingIcon
            aria-label="Opens in a new tab"
          >
            {`Download ${shortReadType} guide (PDF)`}
          </ShortReadDownloadButton>
        }
        description={<OakP>{description}</OakP>}
      />
      <LessonOverviewPresentation asset={assetUrl} title={title} isWorksheet />
    </OakFlex>
  );
};
