import {
  OakFlexProps,
  OakUiRoleToken,
  OakFlex,
  OakSmallPrimaryInvertedButton,
  OakIcon,
  OakBox,
  OakTertiaryInvertedButton,
} from "@oaknational/oak-components";

export type HeaderNavFooterProps = {
  backgroundColorLevel: 1 | 3 | 4;
  type: "unit" | "lesson";
  prevHref?: string;
  nextHref?: string;
  actionButton?: React.ReactElement;
  viewHref: string;
};

const HeaderNavFooter = (props: HeaderNavFooterProps) => {
  return (
    <OakFlex
      $background={`bg-decorative${props.backgroundColorLevel}-subdued`}
      $width={"100%"}
      $pv={"spacing-24"}
      $ph={["spacing-20", "spacing-40"]}
      $flexDirection={["column", "row"]}
      $gap={"spacing-24"}
      $justifyContent="center"
    >
      <OakFlex
        $justifyContent={"space-between"}
        $width={"100%"}
        $gap={"spacing-16"}
        $maxWidth="spacing-1280"
      >
        <OakFlex $gap={"spacing-32"} $alignItems={"center"}>
          <OakTertiaryInvertedButton
            iconName="list"
            element="a"
            href={props.viewHref}
          >
            {`View ${props.type === "unit" ? "all units" : "unit"}`}
          </OakTertiaryInvertedButton>
          <OakBox
            $bl={"border-solid-m"}
            $display={["none", "flex"]}
            $height={"spacing-24"}
            $borderColor={`border-decorative${props.backgroundColorLevel}`}
          />
          <PrevNextButtons $display={["none", "flex"]} {...props} />
        </OakFlex>
        {props.actionButton}
      </OakFlex>
      <OakBox
        $display={["block", "none"]}
        $bt={"border-solid-m"}
        $borderColor={`border-decorative${props.backgroundColorLevel}`}
        $width={"100%"}
      />
      <PrevNextButtons $display={["flex", "none"]} {...props} />
    </OakFlex>
  );
};

type PrevNextButtonsProps = Pick<
  HeaderNavFooterProps,
  "backgroundColorLevel" | "type" | "nextHref" | "prevHref"
> & {
  $display: OakFlexProps["$display"];
};

const PrevNextButtons = ({
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

export default HeaderNavFooter;
