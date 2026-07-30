import {
  OakBox,
  OakCard,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
} from "@oaknational/oak-components";

import { CaseStudyCard } from "@/common-lib/cms-types/caseStudy";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";

export type OaksImpactCaseStudiesProps = {
  title: string;
  caseStudies: CaseStudyCard[];
};

export const OaksImpactCaseStudies = ({
  title,
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
            {title}
          </OakHeading>
          <OakGrid
            as="ul"
            $cg={"spacing-16"}
            $rg={"spacing-16"}
            $pa={"spacing-0"}
            $ma={"spacing-0"}
          >
            {caseStudies.slice(0, 3).map((caseStudy) => (
              <OakGridArea
                as="li"
                key={caseStudy.slug.current}
                $colSpan={[12, 4]}
                $colStart={[1]}
              >
                <OakCard
                  heading={caseStudy.video.title || ""}
                  headingLevel={"div"}
                  href={`/about-us/case-studies/${caseStudy.slug.current}`}
                  imageSrc={
                    getProxiedSanityAssetUrl(caseStudy.image?.asset?.url) ?? ""
                  }
                  aspectRatio="4/3"
                  linkText={"Watch the video"}
                  cardWidth={"100%"}
                />
              </OakGridArea>
            ))}
          </OakGrid>
        </OakFlex>
      </NewGutterMaxWidth>
    </OakBox>
  );
};
