"use client";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakP,
  OakPrimaryButton,
  OakMaxWidth,
} from "@oaknational/oak-components";
import { useMemo, useState } from "react";

import { CurricTimetableHeader } from "../CurricTimetableHeader";
import { CurricShowSteps } from "../CurricShowSteps";
import { CurricNumberInput } from "../CurricNumberInput";

import { useTimetableHeaderParams } from "./useTimetableHeaderParams";

export const CurricTimetablingNewView = () => {
  const DEFAULT_LESSONS = 30;
  const { subject, year, queryParams } = useTimetableHeaderParams();

  const [autumnLessons, setAutumnLessons] = useState(
    parseInt(queryParams.get("autumn") ?? String(DEFAULT_LESSONS), 10),
  );
  const [springLessons, setSpringLessons] = useState(
    parseInt(queryParams.get("spring") ?? String(DEFAULT_LESSONS), 10),
  );
  const [summerLessons, setSummerLessons] = useState(
    parseInt(queryParams.get("summer") ?? String(DEFAULT_LESSONS), 10),
  );

  const nextHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("subject", subject);
    params.set("year", year);
    params.set("autumn", String(autumnLessons));
    params.set("spring", String(springLessons));
    params.set("summer", String(summerLessons));
    return `name?${params.toString()}`;
  }, [subject, year, autumnLessons, springLessons, summerLessons]);

  return (
    <>
      <OakFlex $flexDirection={"column"} $pa={"inner-padding-xl5"}>
        <CurricTimetableHeader
          titleSlot={`Year ${year} ${subject}`}
          illustrationSlug={"magic-carpet"}
          additionalSlot={
            <OakBox $maxWidth={"all-spacing-20"}>
              <CurricShowSteps numberOfSteps={2} currentStepIndex={0} />
            </OakBox>
          }
        />
      </OakFlex>

      <OakMaxWidth $ph={"inner-padding-xl5"}>
        <OakFlex
          $flexDirection={"column"}
          $pa={"inner-padding-xl5"}
          $gap={"space-between-l"}
          $maxWidth={"all-spacing-23"}
        >
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
              <CurricNumberInput
                label="Number of lessons"
                id="autumn-lessons"
                value={autumnLessons}
                onChange={setAutumnLessons}
              />
            </OakFlex>

            <OakFlex
              $flexDirection={"column"}
              $gap={"space-between-m2"}
              $maxWidth={["100%", "all-spacing-20"]}
            >
              <OakHeading id="spring-heading" tag="h3" $font="heading-3">
                Spring
              </OakHeading>
              <CurricNumberInput
                label="Number of lessons"
                id="spring-lessons"
                value={springLessons}
                onChange={setSpringLessons}
              />
            </OakFlex>

            <OakFlex
              $flexDirection={"column"}
              $gap={"space-between-m2"}
              $maxWidth={["100%", "all-spacing-20"]}
            >
              <OakHeading id="summer-heading" tag="h3" $font="heading-3">
                Summer
              </OakHeading>
              <CurricNumberInput
                label="Number of lessons"
                id="summer-lessons"
                value={summerLessons}
                onChange={setSummerLessons}
              />
            </OakFlex>
          </OakFlex>

          <OakPrimaryButton
            element="a"
            href={nextHref}
            pv="inner-padding-m"
            ph="inner-padding-l"
            style={{ height: "auto" }}
          >
            Next
          </OakPrimaryButton>
        </OakFlex>
      </OakMaxWidth>
    </>
  );
};
