import {
  OakFlexProps,
  OakUiRoleToken,
  OakFlex,
  OakSmallPrimaryInvertedButton,
  OakIcon,
} from "@oaknational/oak-components";

export type BaseHeaderNavFooterProps = {
  backgroundColorLevel: 1 | 3 | 4;
  viewHref: string;
  prevHref?: string;
  nextHref?: string;
  downloadButton?: (isStuck: boolean) => React.ReactElement;
};

type PrevNextButtonsProps = {
  type: "unit" | "lesson";
  backgroundColorLevel: 1 | 3 | 4;
  nextHref?: string;
  prevHref?: string;
  $display: OakFlexProps["$display"];
};

export const PrevNextButtons = ({
  $display,
  backgroundColorLevel,
  nextHref,
  prevHref,
  type,
}: PrevNextButtonsProps) => {
  const iconColor =
    `icon-decorative${backgroundColorLevel}` satisfies OakUiRoleToken;

  return (
    <OakFlex $display={$display} $gap={"spacing-16"}>
      {prevHref && (
        <OakSmallPrimaryInvertedButton
          width={["100%", "auto"]}
          element="a"
          href={prevHref}
          iconOverride={
            <OakIcon
              iconName="arrow-left"
              $color={iconColor}
              $width={"spacing-24"}
              $height="spacing-24"
            />
          }
        >
          {"Previous " + type}
        </OakSmallPrimaryInvertedButton>
      )}
      {nextHref && (
        <OakSmallPrimaryInvertedButton
          width={["100%", "auto"]}
          element="a"
          href={nextHref}
          isTrailingIcon
          iconOverride={
            <OakIcon
              iconName="arrow-right"
              $color={iconColor}
              $width={"spacing-24"}
              $height="spacing-24"
            />
          }
        >
          {"Next " + type}
        </OakSmallPrimaryInvertedButton>
      )}
    </OakFlex>
  );
};
