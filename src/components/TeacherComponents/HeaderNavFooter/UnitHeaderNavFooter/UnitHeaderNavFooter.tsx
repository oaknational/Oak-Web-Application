import {
  OakFlex,
  OakBox,
  OakBoxProps,
  OakP,
  OakSmallPrimaryInvertedButton,
  OakFlexProps,
  OakUiRoleToken,
} from "@oaknational/oak-components";
import { Ref } from "react";
import styled, { css, keyframes } from "styled-components";

import {
  BaseHeaderNavFooterProps,
  PrevNextButtons,
} from "@/components/TeacherComponents/HeaderNavFooter/HeaderNavFooterShared";

type DecorativeDividerProps = {
  orientation: "vertical" | "horizontal";
  borderColor: OakUiRoleToken;
  $display?: OakBoxProps["$display"];
};

const DecorativeDivider = ({
  orientation,
  borderColor,
  $display,
}: DecorativeDividerProps) => (
  <OakBox
    $bl={orientation === "vertical" ? "border-solid-m" : undefined}
    $bt={orientation === "horizontal" ? "border-solid-m" : undefined}
    $display={$display}
    $height={orientation === "vertical" ? "spacing-24" : undefined}
    $width={orientation === "horizontal" ? "100%" : undefined}
    $borderColor={borderColor}
  />
);

export type UnitHeaderNavFooterProps = BaseHeaderNavFooterProps & {
  title?: string;
  sentinelRef?: Ref<HTMLDivElement>;
  isStuck?: boolean;
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

/**
 * Fades the bar in when it enters the stuck state. The animation only runs when
 * $animateIn is true, so it plays on the transition into stuck and not on the
 * way back out.
 */
const FadeInFlex = styled(OakFlex)<{ $animateIn?: boolean }>`
  ${(props) =>
    props.$animateIn &&
    css`
      animation: ${fadeIn} 300ms ease-in;
      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    `}
`;

type BackgroundColorLevel = BaseHeaderNavFooterProps["backgroundColorLevel"];

type UnitHeaderNavFooterAppearance = {
  shell: OakFlexProps;
  fadeIn: OakFlexProps;
  content: Pick<OakFlexProps, "$gap" | "$justifyContent" | "$display">;
  displays: {
    stuckVerticalDivider: OakBoxProps["$display"];
    horizontalDivider: OakBoxProps["$display"];
    title: OakBoxProps["$display"];
    desktopNav: OakFlexProps["$display"];
    mobilePrevNext: OakFlexProps["$display"];
    viewAllUnits: OakBoxProps["$display"];
  };
  borderColor: OakUiRoleToken;
};

/**
 * Most of the complexity here comes from having to pin to the bottom of the
 * screen on mobile viewports. position: sticky assumes you're pinning to the top.
 *
 * Positioning per breakpoint:
 *
 * |          | not stuck     | stuck            |
 * | -------- | ---------     | ---------------- |
 * | mobile   | static        | fixed, bottom: 0 |
 * | tablet+  | sticky, top: 0| sticky, top: 0   |
 */
function getUnitHeaderNavFooterAppearance(
  isStuck: boolean | undefined,
  backgroundColorLevel: BackgroundColorLevel,
): UnitHeaderNavFooterAppearance {
  const borderColor =
    `border-decorative${backgroundColorLevel}` satisfies OakUiRoleToken;
  const bgSubdued =
    `bg-decorative${backgroundColorLevel}-subdued` satisfies OakUiRoleToken;
  const bgVerySubdued =
    `bg-decorative${backgroundColorLevel}-very-subdued` satisfies OakUiRoleToken;

  if (!isStuck) {
    return {
      shell: {
        $position: ["static", "sticky"],
        $bottom: [null, null],
        $top: [null, "spacing-0"],
        $left: [null, null],
      },
      fadeIn: {
        $background: bgSubdued,
        $pv: "spacing-24",
        $ph: ["spacing-20", "spacing-40"],
        $maxWidth: "auto",
        $mh: "auto",
        $dropShadow: "drop-shadow-none",
        $bbr: undefined,
        $btr: undefined,
      },
      content: {
        $gap: ["spacing-24", "spacing-16"],
        $justifyContent: "space-between",
        $display: ["flex", "contents"],
      },
      displays: {
        stuckVerticalDivider: "none",
        horizontalDivider: ["block", "none"],
        title: "none",
        desktopNav: ["none", "flex"],
        mobilePrevNext: ["flex", "none"],
        viewAllUnits: "block",
      },
      borderColor,
    };
  }

  return {
    shell: {
      $position: ["fixed", "sticky"],
      $bottom: ["spacing-0", null],
      $top: [null, "spacing-0"],
      $left: ["spacing-0", null],
    },
    fadeIn: {
      $background: bgVerySubdued,
      $pv: ["spacing-16", "spacing-24"],
      $ph: "spacing-16",
      $maxWidth: ["spacing-1280"],
      $mh: "spacing-40",
      $dropShadow: "drop-shadow-standard",
      $bbr: [null, "border-radius-l"],
      $btr: ["border-radius-l", "border-radius-square"],
    },
    content: {
      $gap: ["spacing-16", "spacing-24"],
      $justifyContent: "start",
      $display: "contents",
    },
    displays: {
      stuckVerticalDivider: ["none", "none", "block"],
      horizontalDivider: "none",
      title: ["none", "none", "block"],
      desktopNav: "none",
      mobilePrevNext: "none",
      viewAllUnits: "none",
    },
    borderColor,
  };
}

export const UnitHeaderNavFooter = (props: UnitHeaderNavFooterProps) => {
  const { sentinelRef, isStuck } = props;
  const { shell, fadeIn, content, displays, borderColor } =
    getUnitHeaderNavFooterAppearance(isStuck, props.backgroundColorLevel);

  return (
    <>
      {/* Sentinel element, for checking when the user has scrolled past this point */}
      <OakBox ref={sentinelRef} $height="spacing-0" />
      <OakFlex
        $zIndex={"in-front"}
        {...shell}
        $width={"100%"}
        $justifyContent={"center"}
      >
        <FadeInFlex
          $animateIn={isStuck}
          {...fadeIn}
          $flexDirection={["column", "row"]}
          $width={"100%"}
          $gap={"spacing-24"}
          $justifyContent="center"
        >
          <OakFlex
            $width={"100%"}
            $maxWidth={"spacing-1280"}
            $gap={content.$gap}
            $flexDirection={["column", "row"]}
          >
            <OakFlex
              $justifyContent={content.$justifyContent}
              $alignItems={"center"}
              $width={"100%"}
              $gap={"spacing-16"}
            >
              <OakFlex
                $gap={"spacing-24"}
                $flexDirection="column"
                $width={"100%"}
                $display={content.$display}
              >
                {props.downloadButton?.(Boolean(isStuck))}
                <DecorativeDivider
                  orientation="vertical"
                  borderColor={borderColor}
                  $display={displays.stuckVerticalDivider}
                />
                <DecorativeDivider
                  orientation="horizontal"
                  borderColor={borderColor}
                  $display={displays.horizontalDivider}
                />
              </OakFlex>
              <OakBox $display={displays.title}>
                <OakP $font="heading-7">{props.title}</OakP>
              </OakBox>
              <OakFlex
                as="nav"
                $display={displays.desktopNav}
                $gap={"spacing-16"}
                $alignItems={"center"}
              >
                <PrevNextButtons type="unit" $display={"flex"} {...props} />
                <DecorativeDivider
                  orientation="vertical"
                  borderColor={borderColor}
                />
              </OakFlex>
            </OakFlex>

            <PrevNextButtons
              type="unit"
              $display={displays.mobilePrevNext}
              {...props}
            />
            <OakBox $display={displays.viewAllUnits}>
              <OakSmallPrimaryInvertedButton
                width={["100%", "auto"]}
                iconName="list"
                isTrailingIcon
                $textWrap={"nowrap"}
                element="a"
                href={props.viewHref}
              >
                View all units
              </OakSmallPrimaryInvertedButton>
            </OakBox>
          </OakFlex>
        </FadeInFlex>
      </OakFlex>
    </>
  );
};
