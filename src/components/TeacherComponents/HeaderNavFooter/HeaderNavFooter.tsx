import {
  OakFlexProps,
  OakUiRoleToken,
  OakFlex,
  OakSmallPrimaryInvertedButton,
  OakIcon,
  OakBox,
  OakP,
  OakTertiaryInvertedButton,
} from "@oaknational/oak-components";
import { Ref } from "react";
import styled, { css, keyframes } from "styled-components";

export type HeaderNavFooterProps = {
  backgroundColorLevel: 1 | 3 | 4;
  type: "unit" | "lesson";
  viewHref: string;
  title: string;
  ref: Ref<HTMLDivElement>;
  isStuck: boolean;
  prevHref?: string;
  nextHref?: string;
  actionButton?: React.ReactElement;
};

export const HeaderNavFooter = (props: HeaderNavFooterProps) => {
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
        <OakFlex as="nav" $gap={"spacing-32"} $alignItems={"center"}>
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
      @media (prefers-reduced-motion) {
        animation: none;
      }
    `}
`;

export const StickyHeaderNavFooter = (props: HeaderNavFooterProps) => {
  const { ref, isStuck } = props;
  return (
    <>
      {/* Sentinel element, for checking when the user has scrolled past this point */}
      <OakBox ref={ref} $height="spacing-0" />
      {/**
       * Most of the complexity here comes from having to pin to the bottom
       * of the screen on mobile viewports. position: sticky assumes you're
       * pinning to the top.
       *
       * Positioning per breakpoint:
       *
       * |          | not stuck     | stuck            |
       * | -------- | ---------     | ---------------- |
       * | mobile   | static        | fixed, bottom: 0 |
       * | tablet+  | sticky, top: 0| sticky, top: 0   |
       */}
      <OakFlex
        $zIndex={"in-front"}
        $position={[isStuck ? "fixed" : "static", "sticky"]}
        $bottom={[isStuck ? "spacing-0" : null, null]}
        $top={[null, "spacing-0"]}
        $left={[isStuck ? "spacing-0" : null, null]}
        $width={"100%"}
        $justifyContent={"center"}
      >
        <FadeInFlex
          $animateIn={isStuck}
          $background={
            isStuck
              ? `bg-decorative${props.backgroundColorLevel}-very-subdued`
              : `bg-decorative${props.backgroundColorLevel}-subdued`
          }
          $pv={"spacing-24"}
          $ph={["spacing-20", "spacing-40"]}
          $flexDirection={["column", "row"]}
          $maxWidth={isStuck ? ["spacing-1280"] : "auto"}
          $mh={isStuck ? "spacing-40" : "auto"}
          $width={"100%"}
          $gap={"spacing-24"}
          $justifyContent="center"
          $dropShadow={isStuck ? "drop-shadow-standard" : "drop-shadow-none"}
          $bbr={isStuck ? "border-radius-l" : "border-radius-square"}
        >
          <OakFlex
            $justifyContent={isStuck ? "start" : "space-between"}
            $width={"100%"}
            $gap={"spacing-16"}
            $maxWidth="spacing-1280"
          >
            {props.actionButton}
            <OakBox
              $bl={"border-solid-m"}
              $display={isStuck ? ["none", "none", "block"] : "none"}
              $height={"spacing-24"}
              $borderColor={`border-decorative${props.backgroundColorLevel}`}
            />
            <OakBox $display={isStuck ? ["none", "none", "block"] : "none"}>
              <OakP>{props.title}</OakP>
            </OakBox>
            <OakFlex
              as="nav"
              $display={isStuck ? "none" : ["none", "flex"]}
              $gap={"spacing-32"}
              $alignItems={"center"}
            >
              <PrevNextButtons $display={"flex"} {...props} />
              <OakBox
                $bl={"border-solid-m"}
                $display={"flex"}
                $height={"spacing-24"}
                $borderColor={`border-decorative${props.backgroundColorLevel}`}
              />
            </OakFlex>
          </OakFlex>

          <PrevNextButtons
            $display={isStuck ? "none" : ["flex", "none"]}
            {...props}
          />
          <OakSmallPrimaryInvertedButton
            $display={isStuck ? "none" : "block"}
            width={["100%", "auto"]}
            iconName="list"
            isTrailingIcon
            $textWrap={"nowrap"}
            element="a"
            href={props.viewHref}
          >
            {`View ${props.type === "unit" ? "all units" : "unit"}`}
          </OakSmallPrimaryInvertedButton>
        </FadeInFlex>
      </OakFlex>
    </>
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
