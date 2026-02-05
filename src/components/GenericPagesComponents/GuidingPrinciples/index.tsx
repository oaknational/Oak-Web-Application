import {
  OakFlex,
  OakHeading,
  OakP,
  OakUiRoleToken,
} from "@oaknational/oak-components";
import styled from "styled-components";

import CurricQuote from "@/components/CurriculumComponents/CurricQuote";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import Cover from "@/components/SharedComponents/Cover";
import Illustration from "@/components/SharedComponents/Illustration";

const StyledResponsiveFlex = styled(OakFlex)`
  flex-direction: column;

  @media (min-width: 1000px) {
    flex-direction: row;
  }
`;

export type GuidingPrinciplesProps = {
  accentColor: OakUiRoleToken;
  $background: OakUiRoleToken;
};
export function GuidingPrinciples({
  accentColor,
  $background,
}: GuidingPrinciplesProps) {
  return (
    <StyledResponsiveFlex
      $justifyContent="space-between"
      $alignItems="flex-start"
      $background={$background}
      $borderRadius="border-radius-l"
      $pa={["spacing-24", "spacing-64", "spacing-80"]}
      $gap={["spacing-56", "spacing-80", "spacing-72"]}
    >
      <OakFlex
        $alignItems={["center", "center", "flex-start"]}
        $flexDirection="column"
        $flexGrow={1}
        $flexBasis={0}
        $gap={["spacing-64"]}
      >
        <OakFlex $flexDirection="column">
          <OakHeading tag="h2" $font={["heading-4", "heading-3"]}>
            Our guiding principles
          </OakHeading>

          <OakP $mt={"spacing-16"} $mb={"spacing-12"} $font={"body-1"}>
            We have crafted a set of overarching principles that describe the
            features important to our curricula in all subjects.
          </OakP>
        </OakFlex>

        <Cover
          $width={[300, 450, 450]}
          $height={[270, 420, 420]}
          $position={"relative"}
        >
          <Illustration
            noCrop
            sizes={getSizes([340, 480])}
            slug="curriculum-approach"
            $objectFit="contain"
            $objectPosition={"center"}
            fill
            format={null}
          />
        </Cover>
      </OakFlex>

      <OakFlex
        $flexDirection="column"
        $gap={"spacing-48"}
        $flexGrow={[null, 1]}
        $flexBasis={[null, 0]}
        $pb={["spacing-16", "spacing-0"]}
      >
        <CurricQuote title="Evidence-informed" barColor={accentColor}>
          Our approach enables the rigorous application of research outcomes,
          science of learning and impactful best practice.
        </CurricQuote>
        <CurricQuote
          title="Knowledge and vocabulary rich"
          barColor={accentColor}
        >
          Our curriculum is knowledge and vocabulary rich so that pupils build
          on what they already know to develop deep knowledge and apply this
          through skills.
        </CurricQuote>
        <CurricQuote title="Sequenced and coherent" barColor={accentColor}>
          We carefully and purposefully sequence our curriculum to ensure that
          pupils can build on and make links with existing knowledge. We pay
          attention to vertical coherence via threads, which map the
          developments of concepts over time.
        </CurricQuote>
        <CurricQuote title="Flexible" barColor={accentColor}>
          Our curriculum is flexible by design so that schools can use them in a
          way to fit their setting and meet the varying needs of teachers and
          their pupils - all aligned to the national curriculum.
        </CurricQuote>
        <CurricQuote title="Accessible" barColor={accentColor}>
          Our curriculum is designed to support all pupils to learn and follows
          accessibility guidelines. It uses insights from the science of
          learning to inform how content is designed and presented.
        </CurricQuote>
        <CurricQuote title="Diverse" barColor={accentColor}>
          Our commitment to breadth and diversity in content, language, texts
          and media can be seen throughout our curriculum, to help pupils feel
          positively represented.
        </CurricQuote>
      </OakFlex>
    </StyledResponsiveFlex>
  );
}
