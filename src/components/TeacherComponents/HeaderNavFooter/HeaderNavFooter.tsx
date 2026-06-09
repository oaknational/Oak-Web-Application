import {
  OakFlexProps,
  OakUiRoleToken,
  OakFlex,
  OakSmallPrimaryInvertedButton,
  OakIcon,
  OakBox,
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
        {props.actionButton}
        <OakFlex
          as="nav"
          $display={["none", "flex"]}
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
      <OakBox
        $display={["block", "none"]}
        $bt={"border-solid-m"}
        $borderColor={`border-decorative${props.backgroundColorLevel}`}
        $width={"100%"}
      />
      <PrevNextButtons $display={["flex", "none"]} {...props} />
      <OakSmallPrimaryInvertedButton
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
