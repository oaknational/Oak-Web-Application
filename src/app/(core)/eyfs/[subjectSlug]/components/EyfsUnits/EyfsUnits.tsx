"use client";
import { OakFlex, OakBox, OakHeading } from "@oaknational/oak-components";

import { EYFSLessonCard } from "../EyfsLessonCard";
import { EYFSLessonGroupProvider } from "../EyfsLessonGroupProvider";

import { useEyfsSchoolData } from "./useEyfsSchoolData";

import { EYFSUnit } from "@/node-lib/curriculum-api-2023/queries/eyfs/eyfsSchema";


export const EyfsUnitSection = ({ units }: { units: EYFSUnit[] }) => {
  const { schoolName, schoolId } = useEyfsSchoolData();
  return (
    <EYFSLessonGroupProvider>
      {units.map((u) => (
        <OakFlex $flexDirection={"column"} $gap={"spacing-48"} key={u.title}>
          <OakBox>
            <OakBox
              $pa={"spacing-24"}
              $background={"bg-neutral"}
              $btlr={"border-radius-l"}
              $btrr={"border-radius-l"}
              $width={"fit-content"}
              $mr={"spacing-24"} // ensures title section doesn't fill the full width on mobile
            >
              <OakHeading tag="h2" $font={"heading-5"}>
                {u.title}
              </OakHeading>
            </OakBox>
            <OakFlex
              $background={"bg-neutral"}
              $pa={"spacing-24"}
              $borderRadius={"border-radius-l"}
              $btlr={"border-radius-square"}
              $flexDirection={"column"}
              $gap={"spacing-20"}
            >
              {u.lessons
                .toSorted(
                  (a, b) =>
                    (a.orderInUnit ?? Infinity) - (b.orderInUnit ?? Infinity),
                )
                .map((lesson, index) => (
                  <EYFSLessonCard
                    key={lesson.slug}
                    lesson={lesson}
                    index={index + 1}
                    schoolId={schoolId ?? ""}
                    schoolName={schoolName ?? ""}
                  />
                ))}
            </OakFlex>
          </OakBox>
        </OakFlex>
      ))}
    </EYFSLessonGroupProvider>
  );
};
