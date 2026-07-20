import {
  OakBox,
  OakCard,
  OakFlex,
  OakGrid,
  OakHeading,
} from "@oaknational/oak-components";

import { CaseStudyCard } from "@/common-lib/cms-types/caseStudy";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";

export type OaksImpactCaseStudiesProps = {
  caseStudies: CaseStudyCard[];
};

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
          <OakGrid
            as="ul"
            $gridTemplateColumns={["1fr", "repeat(3, 1fr)"]}
            $cg={"spacing-16"}
            $rg={"spacing-16"}
            $pa={"spacing-0"}
            $ma={"spacing-0"}
          >
            {caseStudies.map((caseStudy) => (
              <OakCard
                as="li"
                key={caseStudy.slug.current}
                heading={caseStudy.video.title || ""}
                headingLevel={"div"}
                href={`#/case-studies/${caseStudy.slug.current}`}
                imageSrc={
                  getProxiedSanityAssetUrl(caseStudy.image?.asset?.url) ?? ""
                }
                aspectRatio="4/3"
                linkText={"Watch the video"}
                cardWidth={"100%"}
              />
            ))}
          </OakGrid>
        </OakFlex>
      </NewGutterMaxWidth>
    </OakBox>
  );
};
