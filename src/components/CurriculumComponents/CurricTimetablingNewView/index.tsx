"use client";
import {
  OakFlex,
  OakHeading,
  OakP,
  OakPrimaryButton,
  OakJauntyAngleLabel,
} from "@oaknational/oak-components";
import { useMemo } from "react";
import Link from "next/link";

import { CurricNumberInput } from "../CurricNumberInput";
import { CurricAngledLabel } from "../CurricAngledLabel";

import {
  simpleObjectAsSearchParams,
  useTimetableParams,
} from "@/utils/curriculum/timetabling";
import { parseSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import { subjectTitleWithCase } from "@/utils/curriculum/formatting";

type CurricTimetablingNewViewProps = {
  subjectPhaseSlug: string;
  subjectTitle?: string;
};
export const CurricTimetablingNewView = ({
  subjectPhaseSlug,
  subjectTitle,
}: CurricTimetablingNewViewProps) => {
  const { subjectSlug } = parseSubjectPhaseSlug(subjectPhaseSlug)!;
  const [data, setData] = useTimetableParams();
  const nextHref = useMemo(
    () => `units?${simpleObjectAsSearchParams(data, { name: "" })}`,
    [data],
  );

  const displaySubjectTitle = subjectTitle
    ? subjectTitleWithCase(subjectTitle)
    : subjectSlug;

  return (
    <OakFlex
      $flexDirection={"column"}
      $pa={["inner-padding-xl", "inner-padding-xl5"]}
      $gap={"space-between-l"}
      $maxWidth={"all-spacing-24"}
      $mh="auto"
      $width="100%"
    >
      <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
        <OakHeading tag="h1" $font="heading-3">
          Create your{" "}
          <CurricAngledLabel>
            {displaySubjectTitle} year {data.year}
          </CurricAngledLabel>{" "}
          timetable
        </OakHeading>
        <OakP $font={["body-2", "body-1"]}>
          <strong>Quick tip:</strong> Plan lessons by actual teaching time,
          adjusting for trips and non-curriculum events.
        </OakP>
      </OakFlex>

      <OakFlex $flexDirection={"column"} $gap={"space-between-l"}>
        <OakFlex
          $flexDirection={"column"}
          $gap={"space-between-m2"}
          $maxWidth={["100%", "all-spacing-20"]}
        >
          <OakHeading id="autumn-heading" tag="h2" $font="heading-4">
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
            <CurricNumberInput
              id="autumn-lessons"
              value={data.autumn ?? 30}
              onChange={(value) => setData({ autumn: value })}
              ariaDescribedBy="autumn-heading"
              min={5}
              max={35}
              step={1}
            />
          </OakFlex>
        </OakFlex>

        <OakFlex
          $flexDirection={"column"}
          $gap={"space-between-m2"}
          $maxWidth={["100%", "all-spacing-20"]}
        >
          <OakHeading id="spring-heading" tag="h2" $font="heading-4">
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
            <CurricNumberInput
              id="spring-lessons"
              value={data.spring ?? 30}
              onChange={(value) => setData({ spring: value })}
              ariaDescribedBy="spring-heading"
              min={5}
              max={35}
              step={1}
            />
          </OakFlex>
        </OakFlex>

        <OakFlex
          $flexDirection={"column"}
          $gap={"space-between-m2"}
          $maxWidth={["100%", "all-spacing-20"]}
        >
          <OakHeading id="summer-heading" tag="h2" $font="heading-4">
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
            <CurricNumberInput
              id="summer-lessons"
              value={data.summer ?? 30}
              onChange={(value) => setData({ summer: value })}
              ariaDescribedBy="summer-heading"
              min={5}
              max={35}
              step={1}
            />
          </OakFlex>
        </OakFlex>
      </OakFlex>

      <OakPrimaryButton
        element={Link}
        href={nextHref}
        pv="inner-padding-m"
        ph="inner-padding-l"
        style={{ height: "auto" }}
      >
        Next
      </OakPrimaryButton>
    </OakFlex>
  );
};
