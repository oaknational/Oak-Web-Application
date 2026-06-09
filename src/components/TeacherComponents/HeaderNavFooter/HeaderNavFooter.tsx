import {
  OakFlexProps,
  OakUiRoleToken,
  OakFlex,
  OakSmallPrimaryInvertedButton,
  OakIcon,
  OakBox,
  OakTertiaryInvertedButton,
} from "@oaknational/oak-components";
import { useRef, useState, useEffect } from "react";

export type HeaderNavFooterProps = {
  backgroundColorLevel: 1 | 3 | 4;
  type: "unit" | "lesson";
  prevHref?: string;
  nextHref?: string;
  actionButton?: React.ReactElement;
  viewHref: string;
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
  console.log(isStuck);
  return (
    <OakFlex
      $zIndex={"in-front"}
      ref={ref}
      $position={"sticky"}
      $top={"spacing-0"}
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
