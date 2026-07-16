import {
  OakBox,
  OakCard,
  OakFlex,
  OakHeading,
} from "@oaknational/oak-components";

import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";

export type OaksImpactCaseStudiesProps = {
  caseStudies: {
    heading: string;
    href: string;
    imageSrc: string;
    linkText?: string;
  }[];
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
          <OakFlex
            as="ul"
            $gap={"spacing-16"}
            $flexDirection={["column", "row"]}
            $pa={"spacing-0"}
            $ma={"spacing-0"}
          >
            {caseStudies.map((caseStudy) => (
              <OakCard
                as="li"
                key={caseStudy.heading}
                heading={caseStudy.heading}
                headingLevel={"div"}
                href={caseStudy.href}
                imageSrc={caseStudy.imageSrc}
                aspectRatio="4/3"
                linkText={caseStudy.linkText || "Watch the video"}
                cardWidth={"100%"}
              />
            ))}
          </OakFlex>
        </OakFlex>
      </NewGutterMaxWidth>
    </OakBox>
  );
};
