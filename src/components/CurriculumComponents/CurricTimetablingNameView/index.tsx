"use client";
import { useEffect, useMemo, useState } from "react";
import {
  OakBox,
  OakFlex,
  OakPrimaryButton,
  OakSecondaryButton,
  OakHeading,
  OakJauntyAngleLabel,
  OakTextInput,
  OakMaxWidth,
} from "@oaknational/oak-components";

import { CurricTimetableHeader } from "../CurricTimetableHeader";
import { CurricShowSteps } from "../CurricShowSteps";
import { useTimetableHeaderParams } from "../CurricTimetablingNewView/useTimetableHeaderParams";

export const CurricTimetablingNameView = () => {
  const { subject, year, name, queryString } = useTimetableHeaderParams();

  const [nameValue, setNameValue] = useState<string>("");

  useEffect(() => {
    if (name && nameValue === "") {
      setNameValue(name);
    }
  }, [name, nameValue]);

  const params = useMemo(() => {
    if (!name && nameValue !== "") {
      const updatedParams = new URLSearchParams(queryString);
      updatedParams.append("name", nameValue);

      return updatedParams.toString();
    }

    return queryString;
  }, [name, queryString, nameValue]);

  return (
    <OakMaxWidth
      $ph={"inner-padding-xl5"}
      $flexDirection={"column"}
      $gap={"space-between-l"}
    >
      <OakFlex $flexDirection={"column"} $pt={"inner-padding-xl5"}>
        <CurricTimetableHeader
          titleSlot={`Year ${year} ${subject}`}
          illustrationSlug={"magic-carpet"}
          additionalSlot={
            <OakBox $maxWidth={"all-spacing-20"}>
              <CurricShowSteps numberOfSteps={2} currentStepIndex={1} />
            </OakBox>
          }
        />
      </OakFlex>

      <OakFlex
        $flexDirection={"column"}
        $gap={"space-between-l"}
        $ph={"inner-padding-xl5"}
      >
        <OakHeading tag="h2" $font="heading-2">
          Name your timetable
        </OakHeading>

        <OakFlex
          $position="relative"
          $flexDirection="column"
          $maxWidth={["100%", "all-spacing-20"]}
        >
          <OakJauntyAngleLabel
            as="label"
            htmlFor="autumn-lessons"
            label="School or class name (optional)"
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
            placeholder="Type school name"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            aria-describedby="autumn-heading"
            wrapperWidth="100%"
            $pv="inner-padding-none"
            $height="all-spacing-10"
          />
        </OakFlex>

        <OakFlex
          $flexDirection={"row"}
          $justifyContent={"start"}
          $gap={"space-between-m"}
          $maxWidth={"all-spacing-23"}
        >
          <OakSecondaryButton
            element="a"
            href={`new?${params}`}
            pv="inner-padding-m"
            ph="inner-padding-l"
            style={{ height: "auto" }}
            iconName="arrow-left"
          >
            Previous
          </OakSecondaryButton>
          <OakPrimaryButton
            element="a"
            href={`units?${params}`}
            pv="inner-padding-m"
            ph="inner-padding-l"
            style={{ height: "auto" }}
            iconName="arrow-right"
            isTrailingIcon
          >
            Finish
          </OakPrimaryButton>
        </OakFlex>
      </OakFlex>
    </OakMaxWidth>
  );
};
