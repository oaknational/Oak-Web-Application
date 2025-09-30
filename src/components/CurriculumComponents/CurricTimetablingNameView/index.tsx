"use client";
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
import { useParams } from "next/navigation";

import { CurricTimetableHeader } from "../CurricTimetableHeader";
import { CurricShowSteps } from "../CurricShowSteps";

import {
  simpleObjectAsSearchParams,
  useTimetableParams,
} from "@/utils/curriculum/timetabling";
import { parseSubjectPhaseSlug } from "@/utils/curriculum/slugs";

export const CurricTimetablingNameView = () => {
  const [data, setData] = useTimetableParams();
  const params = useParams<{ subjectPhaseSlug: string }>();
  const { subjectSlug } = parseSubjectPhaseSlug(params!.subjectPhaseSlug)!;

  return (
    <OakMaxWidth
      $ph={"inner-padding-xl5"}
      $flexDirection={"column"}
      $gap={"space-between-l"}
    >
      <OakFlex $flexDirection={"column"} $pt={"inner-padding-xl5"}>
        <CurricTimetableHeader
          titleSlot={`Year ${data.year} ${subjectSlug}`}
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
            value={data.name}
            onChange={(e) => setData({ name: e.target.value })}
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
            href={`new?${simpleObjectAsSearchParams(data)}`}
            pv="inner-padding-m"
            ph="inner-padding-l"
            style={{ height: "auto" }}
            iconName="arrow-left"
          >
            Previous
          </OakSecondaryButton>
          <OakPrimaryButton
            element="a"
            href={`units?${simpleObjectAsSearchParams(data)}`}
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
