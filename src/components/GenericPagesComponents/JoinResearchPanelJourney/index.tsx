import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakPrimaryButton,
  OakLink,
  OakScreenReader,
} from "@oaknational/oak-components";
import { PortableTextMarkComponentProps } from "@portabletext/react";

import { NewGutterMaxWidth } from "../NewGutterMaxWidth";

import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import { JoinResearchPanelPageBlock } from "@/common-lib/cms-types";
import { targetFromHref } from "@/utils/targetFromHref";
import { aboutUsContactInitiated } from "@/browser-lib/avo/Avo";
import { buildAboutUsContactInitiatedAnalytics } from "@/utils/analytics-builders";

type LocalExternalLinkProps = PortableTextMarkComponentProps<{
  _type: "link";
  href: string;
}> & { onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void };
const LocalExternalLink = (props: LocalExternalLinkProps) => {
  if (!props.value?.href) {
    return null;
  }

  return (
    <OakLink
      href={props.value.href}
      onClick={props.onClick}
      target={targetFromHref(props.value.href)}
      rel="noopener noreferrer"
    >
      {props.children}
    </OakLink>
  );
};

export type JoinResearchPanelJourneyProps = Omit<
  JoinResearchPanelPageBlock<"JoinResearchPanelPageJourney">,
  "__typename"
>;
export default function JoinResearchPanelJourney({
  title,
  steps,
  button,
}: Readonly<JoinResearchPanelJourneyProps>) {
  const ctaHref = getLinkHref(button);
  const ctaTarget = targetFromHref(ctaHref);

  const onClickIntercept = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const matchedHref = e.currentTarget.getAttribute("href");
    if (ctaHref === matchedHref) {
      aboutUsContactInitiated(
        buildAboutUsContactInitiatedAnalytics("join_research_panel"),
      );
    }
  };

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
                      key={step.title}
                      $alignItems={"flex-start"}
                      $flexDirection={"column"}
                      $gap={"spacing-24"}
                    >
                      <OakFlex
                        as="h3"
                        $gap={"spacing-12"}
                        $alignItems={"center"}
                      >
                        <OakFlex
                          $background={"bg-decorative3-subdued"}
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
                          tag={"div"}
                          $color={"text-primary"}
                          $font={["heading-5", "heading-4", "heading-4"]}
                        >
                          {step.title}
                        </OakHeading>
                      </OakFlex>
                      <OakBox>
                        <PortableTextWithDefaults
                          value={step.descriptionRaw}
                          components={{
                            marks: {
                              link: (props) => (
                                <LocalExternalLink
                                  {...props}
                                  onClick={onClickIntercept}
                                />
                              ),
                            },
                          }}
                        />
                      </OakBox>
                    </OakFlex>
                  );
                })}
              </OakFlex>
              <OakPrimaryButton
                element="a"
                href={ctaHref}
                target={ctaTarget}
                iconName="external"
                isTrailingIcon={true}
                rel="noreferrer"
                onClick={onClickIntercept}
              >
                {button.label}
                {ctaTarget === "_blank" && (
                  <OakScreenReader> (opens in a new tab)</OakScreenReader>
                )}
              </OakPrimaryButton>
            </OakFlex>
          </OakGridArea>
        </OakGrid>
      </NewGutterMaxWidth>
    </OakFlex>
  );
}
