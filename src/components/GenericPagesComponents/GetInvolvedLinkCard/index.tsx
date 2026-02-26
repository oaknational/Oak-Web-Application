import {
  OakFlex,
  OakHeading,
  OakHeadingProps,
  OakSecondaryButton,
  OakIcon,
} from "@oaknational/oak-components";
import { aboutUsContactInitiated, AnalyticsUseCaseValueType, ComponentTypeValueType } from "@/browser-lib/avo/Avo";
import { ReactNode } from "react";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { buildAboutUsContactInitiatedAnalytics } from "@/utils/analytics-builders";

const handleClick = (componentType: ComponentTypeValueType | undefined, analyticsUseCase: AnalyticsUseCaseValueType) => {
  if (!componentType) return;

  return aboutUsContactInitiated(
    buildAboutUsContactInitiatedAnalytics(
      {
        componentType,
        analyticsUseCase,
      }
    )
  );
};

type GetInvolvedLinkCardProps = {
  headingTag: OakHeadingProps["tag"];
  headingTitle: string;
  buttons: Array<{
    text: string;
    link: string;
    external?: boolean;
    componentType?: ComponentTypeValueType;
  }>;
  content: string | ReactNode;
};

export function GetInvolvedLinkCard({
  headingTag,
  headingTitle,
  buttons,
  content,
}: Readonly<GetInvolvedLinkCardProps>) {
  const { analyticsUseCase } = useAnalyticsPageProps();

  return (
    <OakFlex $pa={"spacing-24"} $gap={"spacing-32"} $flexDirection={"column"}>
      <OakFlex
        $gap={["spacing-16", "spacing-24", "spacing-24"]}
        $flexDirection={"column"}
      >
        <OakHeading
          tag={headingTag}
          $font={["heading-6", "heading-4", "heading-4"]}
        >
          {headingTitle}
        </OakHeading>
        {content}
      </OakFlex>
      {buttons && buttons.length > 0 && (
        <OakFlex $flexWrap="wrap" $gap="spacing-12">
          {buttons.map((button, index) => (
            <OakSecondaryButton
              key={`${button.text}-${index}`}
              element="a"
              href={button.link}
              target={button.external ? "_blank" : undefined}
              rel={button.external ? "noopener noreferrer" : undefined}
              onClick={() => handleClick(button.componentType, analyticsUseCase)}
              iconOverride={
                button.external ? (
                  <OakIcon
                    iconName="external"
                    alt="external"
                    $width="spacing-24"
                    $height="spacing-24"
                  />
                ) : undefined
              }
              isTrailingIcon={button.external}
            >
              {button.text}
            </OakSecondaryButton>
          ))}
        </OakFlex>
      )}
    </OakFlex>
  );
}
