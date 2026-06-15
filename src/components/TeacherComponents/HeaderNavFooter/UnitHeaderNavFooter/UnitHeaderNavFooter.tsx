import {
  OakFlex,
  OakBox,
  OakP,
  OakSmallPrimaryInvertedButton,
} from "@oaknational/oak-components";
import { Ref } from "react";
import styled, { css, keyframes } from "styled-components";

import {
  BaseHeaderNavFooterProps,
  PrevNextButtons,
} from "@/components/TeacherComponents/HeaderNavFooter/HeaderNavFooterShared";

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

export const UnitHeaderNavFooter = (props: UnitHeaderNavFooterProps) => {
  const { sentinelRef, isStuck } = props;

  return (
    <>
      {/* Sentinel element, for checking when the user has scrolled past this point */}
      <OakBox ref={sentinelRef} $height="spacing-0" />
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
          $ph={isStuck ? "spacing-16" : ["spacing-20", "spacing-40"]}
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
            $width={"100%"}
            $maxWidth={"spacing-1280"}
            $gap={"spacing-16"}
          >
            <OakFlex
              $justifyContent={isStuck ? "start" : "space-between"}
              $alignItems={"center"}
              $width={"100%"}
              $gap={"spacing-16"}
            >
              {props.downloadButton?.(Boolean(isStuck))}
              <OakBox
                $bl={"border-solid-m"}
                $display={isStuck ? ["none", "none", "block"] : "none"}
                $height={"spacing-24"}
                $borderColor={`border-decorative${props.backgroundColorLevel}`}
              />
              <OakBox $display={isStuck ? ["none", "none", "block"] : "none"}>
                <OakP $font="heading-7">{props.title}</OakP>
              </OakBox>
              <OakFlex
                as="nav"
                $display={isStuck ? "none" : ["none", "flex"]}
                $gap={"spacing-16"}
                $alignItems={"center"}
              >
                <PrevNextButtons type="unit" $display={"flex"} {...props} />
                <OakBox
                  $bl={"border-solid-m"}
                  $height={"spacing-24"}
                  $borderColor={`border-decorative${props.backgroundColorLevel}`}
                />
              </OakFlex>
            </OakFlex>

            <PrevNextButtons
              type="unit"
              $display={isStuck ? "none" : ["flex", "none"]}
              {...props}
            />
            <OakBox $display={isStuck ? "none" : "block"}>
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
