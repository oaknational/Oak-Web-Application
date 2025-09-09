"use client";
import { OakBox, OakHeading } from "@oaknational/oak-components";
import { Fragment } from "react";

import { ExtendedUnit } from "./types";

export type SequenceOutputProps = {
  sequence: ExtendedUnit[];
};
export function SequenceOutput({ sequence }: SequenceOutputProps) {
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
