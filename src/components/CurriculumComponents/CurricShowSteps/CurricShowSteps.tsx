import {
  OakBox,
  OakColorToken,
  OakFlex,
  OakFlexProps,
  OakIcon,
  OakIconName,
} from "@oaknational/oak-components";
import { Fragment } from "react";

const DOT_SIZE = 44;

function StepLine({
  $borderStyle,
}: Readonly<Pick<OakFlexProps, "$borderStyle">>) {
  return (
    <OakFlex
      $borderStyle={$borderStyle}
      $ba="border-solid-none"
      $bb={"border-solid-m"}
      $flexGrow={1}
    />
  );
}

type DotWithWingsProps = {
  isFirst: boolean;
  isLast: boolean;
  iconName?: OakIconName;
  $background?: OakColorToken;
};
function DotWithWings({
  isFirst,
  isLast,
  iconName,
  $background,
}: Readonly<DotWithWingsProps>) {
  return (
    <OakFlex
      style={{ width: DOT_SIZE, height: DOT_SIZE }}
      $alignItems={"center"}
      $justifyContent={"center"}
    >
      <StepLine $borderStyle={isFirst ? "none" : "solid"} />
      <OakFlex
        $background={$background}
        $width={"spacing-32"}
        $height={"spacing-32"}
        $borderRadius={"border-radius-circle"}
        $alignItems={"center"}
        $justifyContent={"center"}
        $borderStyle={"solid"}
        $ba="border-solid-m"
        $borderColor={"black"}
      >
        {iconName && (
          <OakIcon
            iconName={iconName}
            $colorFilter="white"
            $width={"spacing-24"}
            $height={"spacing-24"}
          />
        )}
      </OakFlex>
      <StepLine $borderStyle={isLast ? "none" : "solid"} />
    </OakFlex>
  );
}

type CurricShowStepsProps = {
  numberOfSteps: number;
  currentStepIndex: number;
};
export function CurricShowSteps({
  numberOfSteps,
  currentStepIndex,
}: Readonly<CurricShowStepsProps>) {
  return (
    <div>
      <OakBox
        style={{ width: "100%", position: "relative", overflow: "hidden" }}
        $pb={"spacing-32"}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {Array(numberOfSteps)
            .fill(true)
            .map((_, index) => {
              const isLast = index === numberOfSteps - 1;
              const isFirst = index === 0;
              const isCurrent = index === currentStepIndex;
              const isDone = index < currentStepIndex;

              return (
                <Fragment key={index}>
                  {isDone && (
                    <DotWithWings
                      isFirst={isFirst}
                      isLast={isLast}
                      iconName="tick"
                      $background="black"
                    />
                  )}
                  {!isCurrent && !isDone && (
                    <DotWithWings
                      isFirst={isFirst}
                      isLast={isLast}
                      $background="white"
                    />
                  )}
                  {isCurrent && (
                    <OakFlex
                      $borderStyle={"solid"}
                      $borderColor={"black"}
                      $borderRadius={"border-radius-circle"}
                      $alignItems={"center"}
                      $justifyContent={"center"}
                      $ba="border-solid-m"
                      $position={"relative"}
                      style={{ width: DOT_SIZE, height: DOT_SIZE }}
                    >
                      <OakFlex
                        $background={"black"}
                        $width={"spacing-32"}
                        $height={"spacing-32"}
                        $borderRadius={"border-radius-circle"}
                        color="white"
                        $alignItems={"center"}
                        $justifyContent={"center"}
                      />
                      <OakBox
                        $position="absolute"
                        $whiteSpace={"nowrap"}
                        data-testid="step-text"
                        $font={"body-1"}
                        style={{
                          [isLast ? "right" : "left"]: 0,
                          top: DOT_SIZE,
                        }}
                      >
                        Step {currentStepIndex + 1} of {numberOfSteps}
                      </OakBox>
                    </OakFlex>
                  )}
                  {!isLast && <StepLine />}
                </Fragment>
              );
            })}
        </div>
      </OakBox>
    </div>
  );
}
