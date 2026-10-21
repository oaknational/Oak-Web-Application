import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import { PortableTextBlock } from "@portabletext/types";

import { NewGutterMaxWidth } from "../NewGutterMaxWidth";

import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import { Link } from "@/common-lib/cms-types";

export type JoinResearchPanelJourneyProps = {
  title: string;
  steps: {
    title: string;
    descriptionRaw: PortableTextBlock[];
  }[];
  button: { label: string } & Link;
};
export default function JoinResearchPanelJourney({
  title,
  steps,
  button,
}: JoinResearchPanelJourneyProps) {
  return (
    <OakFlex
      $pv={["spacing-56", "spacing-80", "spacing-80"]}
      $alignItems="center"
      $background={"bg-decorative3-very-subdued"}
    >
      <NewGutterMaxWidth>
        <OakGrid>
          <OakGridArea $colSpan={[12, 10, 8]} $colStart={[1, 2, 3]}>
            <OakFlex
              $alignItems={"flex-start"}
              $flexDirection={"column"}
              $background={"text-inverted"}
              $pa={["spacing-24", "spacing-48", "spacing-48"]}
              $borderRadius={"border-radius-m2"}
              $gap={["spacing-32", "spacing-56", "spacing-56"]}
            >
              <OakHeading
                tag={"h2"}
                $color={"text-primary"}
                $font={["heading-4", "heading-3", "heading-3"]}
              >
                {title}
              </OakHeading>
              <OakFlex
                $alignItems={"flex-start"}
                $flexDirection={"column"}
                $gap={"spacing-40"}
              >
                {steps.map((step, stepIndex) => {
                  return (
                    <OakFlex
                      key={stepIndex}
                      $alignItems={"flex-start"}
                      $flexDirection={"column"}
                      $gap={"spacing-24"}
                    >
                      <OakFlex $gap={"spacing-12"} $alignItems={"center"}>
                        <OakFlex
                          $background={"bg-decorative3-very-subdued"}
                          $borderRadius={"border-radius-circle"}
                          $alignItems={"center"}
                          $justifyContent={"center"}
                          $width={"spacing-56"}
                          $height={"spacing-56"}
                          $font={"heading-4"}
                        >
                          {stepIndex + 1}
                        </OakFlex>
                        <OakHeading
                          tag={"h3"}
                          $color={"text-primary"}
                          $font={["heading-5", "heading-4", "heading-4"]}
                        >
                          {step.title}
                        </OakHeading>
                      </OakFlex>
                      <OakBox>
                        <PortableTextWithDefaults value={step.descriptionRaw} />
                      </OakBox>
                    </OakFlex>
                  );
                })}
              </OakFlex>
              <OakPrimaryButton
                element="a"
                href={getLinkHref(button)}
                iconName="external"
              >
                {button.label}
              </OakPrimaryButton>
            </OakFlex>
          </OakGridArea>
        </OakGrid>
      </NewGutterMaxWidth>
    </OakFlex>
  );
}
