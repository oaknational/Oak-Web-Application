"use client";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakIcon,
  OakInlineBanner,
  OakJauntyAngleLabel,
  OakP,
  OakTextInput,
} from "@oaknational/oak-components";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { SequenceOutput } from "./SequenceOutput";
import { slugsToString } from "./helper";
import { squishTimetable } from "./squisher";
import { Input } from "./types";

import { Unit } from "@/utils/curriculum/types";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

function stringIsValidNumber(value: string) {
  return value.trim().match(/^[0-9]+$/) && !Number.isNaN(parseInt(value, 10));
}

type NumberInputProps = {
  label: string;
  id: string;
  value: number;
  onChange: (newValue: number) => void;
};
const NumberInput = ({ label, id, value, onChange }: NumberInputProps) => {
  const [dirtyValue, setDirtyValue] = useState(String(value));
  const onChangeLocal = (e: ChangeEvent<HTMLInputElement>) => {
    const strValue = e.target?.value;
    const newValue = parseInt(strValue);
    setDirtyValue(strValue);
    if (stringIsValidNumber(strValue)) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    setDirtyValue(String(value));
  }, [value]);

  const isErroring = useMemo(
    () => !stringIsValidNumber(dirtyValue),
    [dirtyValue],
  );
  const onBlur = () => {
    if (!stringIsValidNumber(dirtyValue)) {
      setDirtyValue(String(value));
    }
  };

  return (
    <OakBox $position={"relative"}>
      <OakJauntyAngleLabel
        label={label}
        htmlFor={id}
        as="label"
        id={label + "-label"}
        $font={"heading-7"}
        $zIndex="in-front"
        $position="absolute"
        $top={"-20px"}
        $left={"5px"}
        $borderRadius="border-radius-square"
        data-testid="jaunty-label"
        $background="lemon"
      />
      <OakTextInput
        id={id}
        data-testid="text-input"
        onChange={onChangeLocal}
        onBlur={onBlur}
        $pv="inner-padding-none"
        wrapperWidth="100%"
        $height="all-spacing-10"
        value={dirtyValue}
        borderColor={isErroring ? "red" : undefined}
        background={isErroring ? "red30" : undefined}
      />
    </OakBox>
  );
};

type TimetablingProps = {
  sequence: Unit[];
  slugs: CurriculumSelectionSlugs;
};
export function Timetabling({ sequence, slugs }: TimetablingProps) {
  const { phaseSlug, subjectSlug, ks4OptionSlug } = slugs;
  const [data, setData] = useState<Input>({
    autumn1Weeks: 6,
    autumn2Weeks: 7,
    spring1Weeks: 6,
    spring2Weeks: 7,
    summer1Weeks: 6,
    summer2Weeks: 7,
    lessonsPerWeek: 3,
    year: 1,
  });

  const modData = (key: string) => {
    return (v: number) => {
      setData({
        ...data,
        [key]: v,
      });
    };
  };

  const { sequence: newSequence, lessonsLeftOver } = useMemo(
    () => squishTimetable(data, sequence),
    [data, sequence],
  );

  return (
    <OakBox $pa="inner-padding-l">
      <OakBox>
        <OakHeading tag="h1">
          🏓 Timetabling:{" "}
          {[subjectSlug, phaseSlug, ks4OptionSlug].filter(Boolean).join("/")}
        </OakHeading>
        <OakP $mb={"space-between-m"}>
          A test harness for timetabling exploration
        </OakP>

        <OakHeading tag="h2">Sequence details</OakHeading>
        <OakFlex
          $flexDirection={["column", "row", "row"]}
          $gap="all-spacing-8"
          $pb={"inner-padding-xl"}
          $flexWrap={"wrap"}
          $pt={"inner-padding-xl2"}
        >
          <NumberInput
            id={"year"}
            label={"Year"}
            value={data.year}
            onChange={modData("year")}
          />
        </OakFlex>

        <OakHeading tag="h2">Lengths of terms (in weeks)</OakHeading>
        <OakFlex
          $flexDirection={["column", "row", "row"]}
          $gap="all-spacing-3"
          $pb={"inner-padding-xl"}
          $flexWrap={"wrap"}
        >
          <OakFlex
            $minWidth={"all-spacing-17"}
            $flexDirection={"column"}
            $gap="all-spacing-8"
            $pt={"inner-padding-xl2"}
          >
            <NumberInput
              id={"autumn1Weeks"}
              label={"Autumn (half term 1)"}
              value={data.autumn1Weeks}
              onChange={modData("autumn1Weeks")}
            />
            <NumberInput
              id={"autumn2Weeks"}
              label={"Autumn (half term 2)"}
              value={data.autumn2Weeks}
              onChange={modData("autumn2Weeks")}
            />
          </OakFlex>
          <OakFlex
            $minWidth={"all-spacing-17"}
            $flexDirection={"column"}
            $gap="all-spacing-8"
            $pt={"inner-padding-xl2"}
          >
            <NumberInput
              id={"spring1Weeks"}
              label={"Spring (half term 1)"}
              value={data.spring1Weeks}
              onChange={modData("spring1Weeks")}
            />
            <NumberInput
              id={"spring2Weeks"}
              label={"Spring (half term 2)"}
              value={data.spring2Weeks}
              onChange={modData("spring2Weeks")}
            />
          </OakFlex>
          <OakFlex
            $minWidth={"all-spacing-17"}
            $flexDirection={"column"}
            $gap="all-spacing-8"
            $pt={"inner-padding-xl2"}
          >
            <NumberInput
              id={"summer1Weeks"}
              label={"Summer (half term 1)"}
              value={data.summer1Weeks}
              onChange={modData("summer1Weeks")}
            />
            <NumberInput
              id={"summer2Weeks"}
              label={"Summer (half term 2)"}
              value={data.summer2Weeks}
              onChange={modData("summer2Weeks")}
            />
          </OakFlex>
        </OakFlex>

        <OakHeading tag="h2">Lesson details</OakHeading>
        <OakFlex
          $flexDirection={["column", "row", "row"]}
          $gap="all-spacing-8"
          $pb={"inner-padding-xl"}
        >
          <OakFlex
            $flexDirection={"column"}
            $gap="all-spacing-8"
            $pt={"inner-padding-xl2"}
          >
            <NumberInput
              id={"lessonsPerWeek"}
              label={"Lessons per week"}
              value={data.lessonsPerWeek}
              onChange={modData("lessonsPerWeek")}
            />
          </OakFlex>
        </OakFlex>
      </OakBox>
      <OakBox $pv="inner-padding-l">
        <OakInlineBanner
          isOpen={true}
          message={"This doesn't currently support subject categories"}
          onDismiss={() => {}}
          type="info"
          variant="regular"
        />
      </OakBox>
      <OakHeading tag="h2">
        Output sequence
        <Link
          target="_blank"
          href={`/teachers/curriculum/${slugsToString(slugs)}/units`}
        >
          <OakIcon
            style={{ display: "inline-block" }}
            $colorFilter="oakGreen"
            iconName="external"
            $width={"all-spacing-5"}
            $height={"all-spacing-5"}
          />
        </Link>
      </OakHeading>
      <OakP>
        This is the shortened timetable when running through our
        work-in-progress algorithm
      </OakP>
      <SequenceOutput sequence={newSequence} slugs={slugs} />
      {lessonsLeftOver > 0 && (
        <OakInlineBanner
          isOpen={true}
          message={
            <span>
              Note there are <strong>{lessonsLeftOver}</strong> lesson slots
              left over
            </span>
          }
          onDismiss={() => {}}
          type="warning"
          variant="regular"
        />
      )}
    </OakBox>
  );
}
