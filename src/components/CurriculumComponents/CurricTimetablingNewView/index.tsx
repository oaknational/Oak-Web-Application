"use client";
import {
  OakFlex,
  OakHeading,
  OakP,
  OakPrimaryButton,
  OakJauntyAngleLabel,
  OakTextInput,
  OakMaxWidth,
} from "@oaknational/oak-components";

export const CurricTimetablingNewView = () => {
  const DEFAULT_LESSONS = 10;

  return (
    <OakMaxWidth $ph={["inner-padding-m", "inner-padding-xl"]}>
      <OakFlex $flexDirection={"column"} $gap={"space-between-l"}>
        <OakHeading tag="h2" $font="heading-2">
          Enter lessons per term
        </OakHeading>
        <OakP $font={["body-2", "body-1"]}>
          We recommend calculating the lessons per term by the actual teaching
          time, taking into account any other activities beyond the curriculum
          such as school trips.
        </OakP>

        <OakFlex $flexDirection={"column"} $gap={"space-between-l"}>
          <OakFlex
            $flexDirection={"column"}
            $gap={"space-between-m2"}
            $maxWidth={["100%", "all-spacing-20"]}
          >
            <OakHeading id="autumn-heading" tag="h3" $font="heading-3">
              Autumn
            </OakHeading>
            <OakFlex $position="relative" $flexDirection="column">
              <OakJauntyAngleLabel
                as="label"
                htmlFor="autumn-lessons"
                label="Number of lessons"
                $font="heading-7"
                $background="lemon"
                $color="black"
                $zIndex="in-front"
                $position="absolute"
                $top={"-20px"}
                $left={"5px"}
                $borderRadius="border-radius-square"
              />
              <OakTextInput
                id="autumn-lessons"
                defaultValue={String(DEFAULT_LESSONS)}
                disabled
                aria-describedby="autumn-heading"
                wrapperWidth="100%"
                $pv="inner-padding-none"
                $height="all-spacing-10"
              />
            </OakFlex>
          </OakFlex>

          <OakFlex
            $flexDirection={"column"}
            $gap={"space-between-m2"}
            $maxWidth={["100%", "all-spacing-20"]}
          >
            <OakHeading id="spring-heading" tag="h3" $font="heading-3">
              Spring
            </OakHeading>
            <OakFlex $position="relative" $flexDirection="column">
              <OakJauntyAngleLabel
                as="label"
                htmlFor="spring-lessons"
                label="Number of lessons"
                $font="heading-7"
                $background="lemon"
                $color="black"
                $zIndex="in-front"
                $position="absolute"
                $top={"-20px"}
                $left={"5px"}
                $borderRadius="border-radius-square"
              />
              <OakTextInput
                id="spring-lessons"
                defaultValue={String(DEFAULT_LESSONS)}
                disabled
                aria-describedby="spring-heading"
                wrapperWidth="100%"
                $pv="inner-padding-none"
                $height="all-spacing-10"
              />
            </OakFlex>
          </OakFlex>

          <OakFlex
            $flexDirection={"column"}
            $gap={"space-between-m2"}
            $maxWidth={["100%", "all-spacing-20"]}
          >
            <OakHeading id="summer-heading" tag="h3" $font="heading-3">
              Summer
            </OakHeading>
            <OakFlex $position="relative" $flexDirection="column">
              <OakJauntyAngleLabel
                as="label"
                htmlFor="summer-lessons"
                label="Number of lessons"
                $font="heading-7"
                $background="lemon"
                $color="black"
                $zIndex="in-front"
                $position="absolute"
                $top={"-20px"}
                $left={"5px"}
                $borderRadius="border-radius-square"
              />
              <OakTextInput
                id="summer-lessons"
                defaultValue={String(DEFAULT_LESSONS)}
                disabled
                aria-describedby="summer-heading"
                wrapperWidth="100%"
                $pv="inner-padding-none"
                $height="all-spacing-10"
              />
            </OakFlex>
          </OakFlex>
        </OakFlex>

        <OakPrimaryButton
          element="a"
          href="/timetabling/name"
          pv="inner-padding-m"
          ph="inner-padding-l"
          style={{ height: "auto" }}
        >
          Next
        </OakPrimaryButton>
      </OakFlex>
    </OakMaxWidth>
  );
};
