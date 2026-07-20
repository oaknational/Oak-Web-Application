import {
  OakBox,
  OakCard,
  OakFlex,
  OakHeading,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { CaseStudyCard } from "@/common-lib/cms-types/caseStudy";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";

export type OaksImpactCaseStudiesProps = {
  caseStudies: CaseStudyCard[];
};

const UnstyledLi = styled.li`
  display: flex;
  flex: 1 1 0;
  list-style: none;
`;

export const OaksImpactCaseStudies = ({
  caseStudies,
}: OaksImpactCaseStudiesProps) => {
  return (
    <OakBox $background={"bg-decorative2-subdued"}>
      <NewGutterMaxWidth>
        <OakFlex
          $flexDirection={"column"}
          $pv={["spacing-56", "spacing-80"]}
          $gap={"spacing-24"}
        >
          <OakHeading tag={"h2"} $font={["heading-5", "heading-3"]}>
            Case studies
          </OakHeading>
          <OakFlex
            as="ul"
            $gap={"spacing-16"}
            $flexDirection={["column", "row"]}
            $pa={"spacing-0"}
            $ma={"spacing-0"}
          >
            {caseStudies.map((caseStudy) => (
              <UnstyledLi key={caseStudy.slug.current}>
                <OakCard
                  heading={caseStudy.video.title || ""}
                  headingLevel={"div"}
                  href={`#/case-studies/${caseStudy.slug.current}`}
                  imageSrc={caseStudy.image.asset?.url}
                  aspectRatio="4/3"
                  linkText={"Watch the video"}
                  cardWidth={"100%"}
                />
              </UnstyledLi>
            ))}
          </OakFlex>
        </OakFlex>
      </NewGutterMaxWidth>
    </OakBox>
  );
};
