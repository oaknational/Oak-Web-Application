import {
  OakBox,
  OakCard,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
} from "@oaknational/oak-components";

import { getCaseStudyTagBackground } from "./getCaseStudyTagBackground";

import { CaseStudyCard } from "@/common-lib/cms-types/caseStudy";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { resolveOakHref } from "@/common-lib/urls";

export type CaseStudiesSectionProps = {
  title: string;
  caseStudies: CaseStudyCard[];
  showTags?: boolean;
};

export const CaseStudiesSection = ({
  title,
  caseStudies,
  showTags = false,
}: CaseStudiesSectionProps) => {
  return (
    <OakBox $background={"bg-decorative2-subdued"}>
      <NewGutterMaxWidth>
        <OakFlex
          $flexDirection={"column"}
          $pv={["spacing-56", "spacing-80"]}
          $gap={"spacing-24"}
        >
          <OakGrid>
            <OakGridArea
              $colSpan={caseStudies.length === 2 ? [12, 8, 8] : [12]}
              $colStart={caseStudies.length === 2 ? [1, 3, 3] : [1]}
            >
              <OakHeading tag={"h2"} $font={["heading-5", "heading-3"]}>
                {title}
              </OakHeading>
            </OakGridArea>
          </OakGrid>
          <OakGrid
            as="ul"
            $cg={"spacing-16"}
            $rg={"spacing-16"}
            $pa={"spacing-0"}
            $ma={"spacing-0"}
          >
            {caseStudies.slice(0, 3).map((caseStudy, index) => (
              <OakGridArea
                as="li"
                key={caseStudy.slug.current}
                $colSpan={[12, 4]}
                $colStart={
                  caseStudies.length === 2
                    ? [1, index === 0 ? 3 : 7]
                    : [1, null]
                }
              >
                <OakCard
                  heading={caseStudy.title ?? ""}
                  headingLevel={"div"}
                  href={resolveOakHref({
                    page: "about-case-study",
                    slug: caseStudy.slug.current,
                  })}
                  imageSrc={
                    getProxiedSanityAssetUrl(caseStudy.image?.asset?.url) ?? ""
                  }
                  aspectRatio="4/3"
                  linkText={
                    !showTags && caseStudy.video ? "Watch the video" : undefined
                  }
                  cardWidth={"100%"}
                  tagName={showTags ? (caseStudy.tag ?? undefined) : undefined}
                  tagBackground={
                    showTags
                      ? getCaseStudyTagBackground(caseStudy.tag)
                      : undefined
                  }
                />
              </OakGridArea>
            ))}
          </OakGrid>
        </OakFlex>
      </NewGutterMaxWidth>
    </OakBox>
  );
};
