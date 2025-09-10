"use client";
import { OakBox, OakIcon } from "@oaknational/oak-components";
import { Fragment } from "react";
import Link from "next/link";

import { ExtendedUnit, ExtendedUnitOption } from "./types";
import { slugsToString } from "./helper";

import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

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
            🧑‍🏫 Lesson#{index + 1}: {lesson.title}
          </li>
        );
      })}
    </ul>
  );
}

function UnitOption({
  unitOption,
  index,
  slugs,
}: {
  unitOption: ExtendedUnitOption;
  index: number;
  slugs: CurriculumSelectionSlugs;
}) {
  const allOmitted = unitOption.lessons.every((lesson) => !lesson.included);
  return (
    <Fragment key={unitOption.slug}>
      <li
        style={{
          textDecoration: allOmitted ? "line-through" : "",
          verticalAlign: "middle",
        }}
      >
        🗂️ UnitOption#{index + 1}: {unitOption.title}
        <Link
          target="_blank"
          href={`/teachers/curriculum/${slugsToString(slugs)}/units/${unitOption.slug}`}
        >
          <OakIcon
            style={{ display: "inline-block" }}
            $colorFilter="oakGreen"
            iconName="external"
            $width={"all-spacing-5"}
            $height={"all-spacing-5"}
          />
        </Link>
      </li>
      <Lessons unit={unitOption} />
    </Fragment>
  );
}

function Unit({
  unit,
  index,
  slugs,
}: {
  unit: ExtendedUnit;
  index: number;
  slugs: CurriculumSelectionSlugs;
}) {
  const hasOptions = unit.unit_options.length > 0;
  const allOmitted = unit.lessons.every((lesson) => !lesson.included);
  return (
    <Fragment key={unit.slug}>
      <li style={{ textDecoration: allOmitted ? "line-through" : "" }}>
        {hasOptions ? "📦" : "🗂️"} Unit#{index}: {unit.title}{" "}
        <Link
          target="_blank"
          href={`/teachers/curriculum/${slugsToString(slugs)}/units/${unit.slug}`}
        >
          <OakIcon
            style={{ display: "inline-block" }}
            $colorFilter="oakGreen"
            iconName="external"
            $width={"all-spacing-5"}
            $height={"all-spacing-5"}
          />
        </Link>
      </li>
      <ul>
        {hasOptions &&
          unit.unit_options.map((unitOption, unitOptionIndex) => {
            return (
              <UnitOption
                key={unitOption.slug}
                unitOption={unitOption}
                index={unitOptionIndex}
                slugs={slugs}
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
  slugs: CurriculumSelectionSlugs;
};
export function SequenceOutput({ slugs, sequence }: SequenceOutputProps) {
  return (
    <OakBox>
      <ul>
        {sequence.map((unit, unitIndex) => {
          return (
            <Unit
              key={`${unit.slug}-${unitIndex}`}
              unit={unit}
              index={unitIndex}
              slugs={slugs}
            />
          );
        })}
      </ul>
    </OakBox>
  );
}
