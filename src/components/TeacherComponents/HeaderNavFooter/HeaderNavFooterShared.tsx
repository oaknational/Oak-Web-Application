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
  next?: {
    href: string;
    onClick?: () => void;
  };
  prev?: {
    href: string;
    onClick?: () => void;
  };
  downloadButton?: (isStuck: boolean) => React.ReactElement;
};

type PrevNextButtonsProps = Pick<
  BaseHeaderNavFooterProps,
  "prev" | "next" | "backgroundColorLevel"
> & {
  type: "unit" | "lesson";
  $display: OakFlexProps["$display"];
};

export const PrevNextButtons = ({
  $display,
  backgroundColorLevel,
  type,
  prev,
  next,
}: PrevNextButtonsProps) => {
  const iconColor =
    `icon-decorative${backgroundColorLevel}` satisfies OakUiRoleToken;

  return (
    <OakFlex $display={$display} $gap={"spacing-16"}>
      {prev && (
        <OakSmallPrimaryInvertedButton
          width={["100%", "auto"]}
          element="a"
          href={prev.href}
          onClick={prev.onClick}
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
      {next && (
        <OakSmallPrimaryInvertedButton
          width={["100%", "auto"]}
          element="a"
          href={next.href}
          onClick={next.onClick}
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
