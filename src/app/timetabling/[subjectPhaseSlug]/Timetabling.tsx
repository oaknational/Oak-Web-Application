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
  return (
    value.trim().match(/^[0-9.]+$/) &&
    !Number.isNaN(parseInt(value, 10)) &&
    !Number.isNaN(parseFloat(value))
  );
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
    const newValue = strValue.match(/\./)
      ? parseFloat(strValue)
      : parseInt(strValue);
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

type Slots = {
  autumn1Lessons: number;
  autumn2Lessons: number;
  spring1Lessons: number;
  spring2Lessons: number;
  summer1Lessons: number;
  summer2Lessons: number;
};

function genSlots(numSlots: number): Slots {
  // Note: We floor/ceil so we don't get fractional on weeks with even/odd numbers.
  return {
    autumn1Lessons: Math.floor(numSlots * 6),
    autumn2Lessons: Math.ceil(numSlots * 7),
    spring1Lessons: Math.floor(numSlots * 6),
    spring2Lessons: Math.ceil(numSlots * 7),
    summer1Lessons: Math.floor(numSlots * 6),
    summer2Lessons: Math.ceil(numSlots * 7),
  };
}
const DEFAULT_LESSON_SLOTS: Slots = genSlots(1);

function getLessonsPerTerm({
  subject,
  year,
}: {
  subject: string;
  year: number;
}) {
  const MAPPINGS: Record<string, Slots> = {
    "maths:1": genSlots(5),
    "maths:2": genSlots(5),
    "maths:3": genSlots(5),
    "maths:4": genSlots(5),
    "maths:5": genSlots(5),
    "maths:6": genSlots(5),
    "maths:7": genSlots(5),
    "maths:8": genSlots(5),
    "maths:9": genSlots(5),
    "maths:10": genSlots(5),
    "maths:11": genSlots(5),
    // ------
    "history:1": genSlots(1),
    "history:2": genSlots(1),
    "history:3": genSlots(1),
    "history:4": genSlots(1),
    "history:5": genSlots(1),
    "history:6": genSlots(1),
    "history:7": genSlots(2),
    "history:8": genSlots(2),
    "history:9": genSlots(2),
    "history:10": genSlots(2),
    "history:11": genSlots(2),
    // ------
    "geography:1": genSlots(1),
    "geography:2": genSlots(1),
    "geography:3": genSlots(1),
    "geography:4": genSlots(1),
    "geography:5": genSlots(1),
    "geography:6": genSlots(1),
    "geography:7": genSlots(2),
    "geography:8": genSlots(2),
    "geography:9": genSlots(2),
    "geography:10": genSlots(2),
    "geography:11": genSlots(2),
    // ------
    "music:1": genSlots(1),
    "music:2": genSlots(1),
    "music:3": genSlots(1),
    "music:4": genSlots(1),
    "music:5": genSlots(1),
    "music:6": genSlots(1),
    "music:7": genSlots(1),
    "music:8": genSlots(1),
    "music:9": genSlots(1),
    "music:10": genSlots(2),
    "music:11": genSlots(2),
    // ------
    "religious-education:1": genSlots(1),
    "religious-education:2": genSlots(1),
    "religious-education:3": genSlots(1),
    "religious-education:4": genSlots(1),
    "religious-education:5": genSlots(1),
    "religious-education:6": genSlots(1),
    "religious-education:7": genSlots(1),
    "religious-education:8": genSlots(1),
    "religious-education:9": genSlots(1),
    "religious-education:10": genSlots(1),
    "religious-education:11": genSlots(1),
    // ------
    "computing:1": genSlots(0.5),
    "computing:2": genSlots(0.5),
    "computing:3": genSlots(0.5),
    "computing:4": genSlots(1),
    "computing:5": genSlots(1),
    "computing:6": genSlots(1),
    "computing:7": genSlots(1),
    "computing:8": genSlots(1),
    "computing:9": genSlots(1),
    "computing:10": genSlots(1),
    "computing:11": genSlots(1),
    // ------
    "design-technology:1": genSlots(1),
    "design-technology:2": genSlots(1),
    "design-technology:3": genSlots(1),
    "design-technology:4": genSlots(1),
    "design-technology:5": genSlots(1),
    "design-technology:6": genSlots(1),
    "design-technology:7": genSlots(1),
    "design-technology:8": genSlots(1),
    "design-technology:9": genSlots(1),
    "design-technology:10": genSlots(2),
    "design-technology:11": genSlots(2),
    // ------
    "art:1": genSlots(1),
    "art:2": genSlots(1),
    "art:3": genSlots(1),
    "art:4": genSlots(1),
    "art:5": genSlots(1),
    "art:6": genSlots(1),
    "art:7": genSlots(1),
    "art:8": genSlots(1),
    "art:9": genSlots(1),
    "art:10": genSlots(2),
    "art:11": genSlots(2),
    // ------
    "physical-education:1": genSlots(2),
    "physical-education:2": genSlots(2),
    "physical-education:3": genSlots(2),
    "physical-education:4": genSlots(2),
    "physical-education:5": genSlots(2),
    "physical-education:6": genSlots(2),
    "physical-education:7": genSlots(2),
    "physical-education:8": genSlots(2),
    "physical-education:9": genSlots(2),
    "physical-education:10": genSlots(2),
    "physical-education:11": genSlots(2),
  } as const;

  const key = `${subject}:${year}`;
  return MAPPINGS[key] ?? { ...DEFAULT_LESSON_SLOTS };
}

type TimetablingProps = {
  sequence: Unit[];
  slugs: CurriculumSelectionSlugs;
};
export function Timetabling({ sequence, slugs }: TimetablingProps) {
  const { phaseSlug, subjectSlug, ks4OptionSlug } = slugs;
  const [data, setData] = useState<Input>(() => {
    const year = slugs.phaseSlug === "primary" ? 1 : 7;
    const output: Input = {
      year,
      ...getLessonsPerTerm({
        subject: slugs.subjectSlug,
        year,
      }),
    };
    return output;
  });

  useEffect(() => {
    const lessonsPerTerm = getLessonsPerTerm({
      subject: slugs.subjectSlug,
      year: data.year,
    });
    setData((data) => {
      return { ...data, ...lessonsPerTerm };
    });
  }, [slugs.subjectSlug, data.year]);

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

        <OakHeading tag="h2">Avaliable lessons in terms</OakHeading>
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
              id={"autumn1Lessons"}
              label={"Autumn (half term 1)"}
              value={data.autumn1Lessons}
              onChange={modData("autumn1Lessons")}
            />
            <NumberInput
              id={"autumn2Lessons"}
              label={"Autumn (half term 2)"}
              value={data.autumn2Lessons}
              onChange={modData("autumn2Lessons")}
            />
          </OakFlex>
          <OakFlex
            $minWidth={"all-spacing-17"}
            $flexDirection={"column"}
            $gap="all-spacing-8"
            $pt={"inner-padding-xl2"}
          >
            <NumberInput
              id={"spring1Lessons"}
              label={"Spring (half term 1)"}
              value={data.spring1Lessons}
              onChange={modData("spring1Lessons")}
            />
            <NumberInput
              id={"spring2Lessons"}
              label={"Spring (half term 2)"}
              value={data.spring2Lessons}
              onChange={modData("spring2Lessons")}
            />
          </OakFlex>
          <OakFlex
            $minWidth={"all-spacing-17"}
            $flexDirection={"column"}
            $gap="all-spacing-8"
            $pt={"inner-padding-xl2"}
          >
            <NumberInput
              id={"summer1Lessons"}
              label={"Summer (half term 1)"}
              value={data.summer1Lessons}
              onChange={modData("summer1Lessons")}
            />
            <NumberInput
              id={"summer2Lessons"}
              label={"Summer (half term 2)"}
              value={data.summer2Lessons}
              onChange={modData("summer2Lessons")}
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
