import {
  OakFlexProps,
  OakUiRoleToken,
  OakFlex,
  OakSmallPrimaryInvertedButton,
  OakIcon,
  OakBox,
  OakP,
} from "@oaknational/oak-components";
import { useRef, useState, useEffect } from "react";

export type HeaderNavFooterProps = {
  backgroundColorLevel: 1 | 3 | 4;
  type: "unit" | "lesson";
  prevHref?: string;
  nextHref?: string;
  actionButton?: React.ReactElement;
  viewHref: string;
  title: string;
};

function useDetectStuck() {
  const ref = useRef<HTMLDivElement>(null);

  const [isStuck, setIsStuck] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([event]) => setIsStuck(event ? event.intersectionRatio < 1 : false),
      { threshold: [1], rootMargin: "-1px 0px 0px 0px" },
    );
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, isStuck };
}

const HeaderNavFooter = (props: HeaderNavFooterProps) => {
  const { ref, isStuck } = useDetectStuck();

  return (
    <OakFlex
      $zIndex={"in-front"}
      ref={ref}
      $position={"sticky"}
      $top={"spacing-0"}
      $width={"100%"}
      $justifyContent={"center"}
    >
      <OakFlex
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
      </OakFlex>
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

export default HeaderNavFooter;
