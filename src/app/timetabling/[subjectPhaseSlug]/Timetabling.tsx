"use client";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakJauntyAngleLabel,
  OakP,
  OakTextInput,
} from "@oaknational/oak-components";
import { Fragment, useMemo, useState } from "react";

import { ExtendedUnit } from "./types";

import { Unit } from "@/utils/curriculum/types";

type Data = {
  autumn1Weeks: number;
  autumn2Weeks: number;
  spring1Weeks: number;
  spring2Weeks: number;
  summer1Weeks: number;
  summer2Weeks: number;
  lessonsPerWeek: number;
  lessonDuration: number;
  topics: string[];
};

type NumberInputProps = {
  label: string;
  id: string;
  value: number;
  onChange: (newValue: number) => void;
};
const NumberInput = ({ label, id, value, onChange }: NumberInputProps) => {
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
        onChange={(e) => onChange(parseInt(e.target?.value))}
        $pv="inner-padding-none"
        wrapperWidth="100%"
        $height="all-spacing-10"
        value={String(value)}
      />
    </OakBox>
  );
};

// TODO: This is the bit we need to work out
// What is the optimum algo for lessons
function runAlgo(input: Data, sequence: Unit[]): ExtendedUnit[] {
  const totalNumberOfWeeks =
    input.autumn1Weeks +
    input.autumn2Weeks +
    input.spring1Weeks +
    input.spring2Weeks +
    input.summer1Weeks +
    input.summer2Weeks;
  const totalNumberOfLessons = input.lessonsPerWeek * totalNumberOfWeeks;

  let lessonsLeftOver = totalNumberOfLessons;

  return sequence.map((unit) => {
    return {
      ...unit,
      lessons: (unit.lessons ?? []).map((lesson) => {
        lessonsLeftOver--;
        return {
          ...lesson,
          included: lessonsLeftOver > -1,
        };
      }),
    };
  });
}

type TimetablingProps = {
  sequence: Unit[];
};
export function Timetabling({ sequence }: TimetablingProps) {
  const [data, setData] = useState<Data>({
    autumn1Weeks: 6,
    autumn2Weeks: 6,
    spring1Weeks: 6,
    spring2Weeks: 6,
    summer1Weeks: 6,
    summer2Weeks: 6,
    lessonsPerWeek: 2,
    lessonDuration: 60,
    topics: [],
  });

  const modData = (key: string) => {
    return (v: number) => {
      setData({
        ...data,
        [key]: v,
      });
    };
  };

  const output = useMemo(() => runAlgo(data, sequence), [data, sequence]);

  return (
    <OakBox $pa="inner-padding-l">
      <OakBox>
        <OakHeading tag="h1">Timetabling</OakHeading>
        <OakP $mb={"space-between-m"}>
          A test harness for timetabling exploration
        </OakP>

        <OakHeading tag="h2">Lengths of terms (in weeks)</OakHeading>
        <OakFlex
          $flexDirection={"row"}
          $gap="all-spacing-8"
          $pb={"inner-padding-xl"}
          $flexWrap={"wrap"}
        >
          <OakFlex
            $minWidth={"all-spacing-19"}
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
            $minWidth={"all-spacing-19"}
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
            $minWidth={"all-spacing-19"}
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
          $flexDirection={"row"}
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
            <NumberInput
              id={"lessonDuration"}
              label={"Lesson duration"}
              value={data.lessonDuration}
              onChange={modData("lessonDuration")}
            />
          </OakFlex>
        </OakFlex>
      </OakBox>
      <SequenceOutput sequence={output} />
    </OakBox>
  );
}

type SequenceOutputProps = {
  sequence: ExtendedUnit[];
};
function SequenceOutput({ sequence }: SequenceOutputProps) {
  return (
    <OakBox>
      <OakHeading tag="h2">Output</OakHeading>
      <ul>
        {sequence.map((unit) => {
          const allOmitted = unit.lessons.every((lesson) => !lesson.included);
          return (
            <Fragment key={unit.slug}>
              <li style={{ textDecoration: allOmitted ? "line-through" : "" }}>
                {unit.title}
              </li>
              <ul>
                {unit.lessons.map((lesson) => {
                  return (
                    <li
                      key={lesson.slug}
                      style={{
                        textDecoration: !lesson.included ? "line-through" : "",
                      }}
                    >
                      {lesson.title}
                    </li>
                  );
                })}
              </ul>
            </Fragment>
          );
        })}
      </ul>
    </OakBox>
  );
}
