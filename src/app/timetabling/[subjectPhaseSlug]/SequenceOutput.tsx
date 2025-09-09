"use client";
import { OakBox, OakHeading } from "@oaknational/oak-components";
import { Fragment } from "react";

import { ExtendedUnit, ExtendedUnitOption } from "./types";

function Lessons({ unit }: { unit: ExtendedUnit | ExtendedUnitOption }) {
  return (
    <ul>
      {unit.lessons.map((lesson, index) => {
        return (
          <li
            key={lesson.slug}
            style={{
              textDecoration: !lesson.included ? "line-through" : "",
            }}
          >
            Lesson[{index + 1}]: {lesson.title}
          </li>
        );
      })}
    </ul>
  );
}

function UnitOption({
  unit,
  index,
}: {
  unit: ExtendedUnitOption;
  index: number;
}) {
  const allOmitted = unit.lessons.every((lesson) => !lesson.included);
  return (
    <Fragment key={unit.slug}>
      <li style={{ textDecoration: allOmitted ? "line-through" : "" }}>
        UnitOption[<strong>{index + 1}</strong>]: {unit.title}
      </li>
      <Lessons unit={unit} />
    </Fragment>
  );
}

function Unit({ unit, index }: { unit: ExtendedUnit; index: number }) {
  const hasOptions = unit.unit_options.length > 0;
  const allOmitted = unit.lessons.every((lesson) => !lesson.included);
  return (
    <Fragment key={unit.slug}>
      <li style={{ textDecoration: allOmitted ? "line-through" : "" }}>
        Unit[<strong>{index}</strong>]: {unit.title}{" "}
        {hasOptions ? "(has options)" : ""}
      </li>
      <ul>
        {hasOptions &&
          unit.unit_options.map((unitOption, unitOptionIndex) => {
            return (
              <UnitOption
                key={unitOption.slug}
                unit={unitOption}
                index={unitOptionIndex}
              />
            );
          })}
      </ul>
      {!hasOptions && <Lessons unit={unit} />}
    </Fragment>
  );
}

export type SequenceOutputProps = {
  sequence: ExtendedUnit[];
};
export function SequenceOutput({ sequence }: SequenceOutputProps) {
  return (
    <OakBox>
      <OakHeading tag="h2">Output</OakHeading>
      <ul>
        {sequence.map((unit, unitIndex) => {
          return <Unit key={unit.slug} unit={unit} index={unitIndex} />;
        })}
      </ul>
    </OakBox>
  );
}
