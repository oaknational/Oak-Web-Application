"use client";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakP,
  OakPrimaryButton,
  OakJauntyAngleLabel,
  OakTextInput,
  OakMaxWidth,
} from "@oaknational/oak-components";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { CurricTimetableHeader } from "../CurricTimetableHeader";
import { CurricShowSteps } from "../CurricShowSteps";

const ALLOWED_KEYS = ["subject", "year", "autumn", "spring", "summer"] as const;

export const CurricTimetablingNewView = () => {
  const DEFAULT_LESSONS = 30;
  const DEFAULT_SUBJECT = "maths";
  const DEFAULT_YEAR = "1";

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Build target query params
  const canonicalQueryParamsString = useMemo(() => {
    const params = new URLSearchParams();
    const subject = searchParams?.get("subject") ?? DEFAULT_SUBJECT;
    const year = searchParams?.get("year") ?? DEFAULT_YEAR;
    params.set("subject", subject);
    params.set("year", year);
    (["autumn", "spring", "summer"] as const).forEach((key) => {
      const value = searchParams?.get(key) ?? String(DEFAULT_LESSONS);
      params.set(key, value);
    });
    return params.toString();
  }, [searchParams, DEFAULT_SUBJECT, DEFAULT_YEAR, DEFAULT_LESSONS]);

  // Extraction of subject/year for UI
  const canonicalSelection = useMemo(() => {
    const subject = searchParams?.get("subject") ?? DEFAULT_SUBJECT;
    const year = searchParams?.get("year") ?? DEFAULT_YEAR;
    return { subject, year };
  }, [searchParams, DEFAULT_SUBJECT, DEFAULT_YEAR]);

  // Limit current URL to allowed keys
  const currentQueryParamsString = useMemo(() => {
    const filtered = new URLSearchParams();
    if (searchParams) {
      ALLOWED_KEYS.forEach((key) => {
        const value = searchParams.get(key);
        if (value !== null) filtered.set(key, value);
      });
    }
    return filtered.toString();
  }, [searchParams]);

  // Ensure that the URL shows only allowed params
  useEffect(() => {
    if (currentQueryParamsString !== canonicalQueryParamsString) {
      router.replace(`${pathname}?${canonicalQueryParamsString}`);
    }
  }, [currentQueryParamsString, canonicalQueryParamsString, router, pathname]);

  const nextHref = `name?${canonicalQueryParamsString}`;

  return (
    <>
      <OakFlex $flexDirection={"column"} $pa={"inner-padding-xl5"}>
        <CurricTimetableHeader
          titleSlot={`Year ${canonicalSelection.year} ${canonicalSelection.subject}`}
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
