"use client";

import { use } from "react";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakMaxWidth,
  OakUL,
  OakLI,
  OakLink,
} from "@oaknational/oak-components";

// Stub data for spike - no real data loading
const STUB_LESSONS = [
  { slug: "lesson-1", title: "Lesson 1: Introduction" },
  { slug: "lesson-2", title: "Lesson 2: Core concepts" },
  { slug: "lesson-3", title: "Lesson 3: Practice" },
  { slug: "lesson-4", title: "Lesson 4: Application" },
];

type PageProps = {
  params: Promise<{ subjectPhaseSlug: string; tab: string; unitSlug: string }>;
};

export default function LessonIndexPage({ params }: PageProps) {
  const { unitSlug } = use(params);

  // Stub unit title - in real impl would come from API
  const unitTitle = `Unit: ${unitSlug.replace(/-/g, " ")}`;

  return (
    <OakMaxWidth $ph={"spacing-16"}>
      <OakBox $mt={"spacing-32"}>
        <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
          <OakHeading $font={["heading-5", "heading-4"]} tag="h1">
            {unitTitle}
          </OakHeading>
          <OakUL aria-label="Lessons" $reset>
            {STUB_LESSONS.map((lesson) => (
              <OakLI key={lesson.slug} $mb={"spacing-8"}>
                <OakLink href="#">{lesson.title}</OakLink>
              </OakLI>
            ))}
          </OakUL>
        </OakFlex>
      </OakBox>
    </OakMaxWidth>
  );
}
