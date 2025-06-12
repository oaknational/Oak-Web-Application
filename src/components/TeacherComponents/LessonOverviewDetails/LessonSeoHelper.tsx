import { convertSubjectToSlug } from "../helpers/convertSubjectToSlug";
import { getSubjectPhaseSlug } from "../helpers/getSubjectPhaseSlug";
import {
  formatSubjectName,
  getPhase,
} from "../helpers/seoTextHelpers/seoText.helpers";

import { resolveOakHref } from "@/common-lib/urls";
import {
  OakBasicAccordion,
  OakHeading,
  OakP,
  OakLink,
} from "@/styles/oakThemeApp";

export const LessonSeoHelper = ({
  year,
  subject,
  subjectSlug,
  parentSubject,
  unit,
  lesson,
  examBoardSlug,
  keystage,
  lessonSlug,
  programmeSlug,
  unitSlug,
  disablePupilLink,
}: {
  year: string;
  subject: string;
  subjectSlug: string;
  parentSubject: string | undefined | null;
  examBoardSlug: string | undefined | null;
  unit: string;
  lesson: string;
  keystage: string;
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
  disablePupilLink?: boolean;
}) => {
  const linkSubject = parentSubject
    ? convertSubjectToSlug(parentSubject)
    : subjectSlug;

  const hideCurriculumLink =
    subjectSlug === "rshe-pshe" || subjectSlug === "financial-education";

  return (
    <OakBasicAccordion
      header={
        <OakHeading $font="heading-5" tag="h3" $textAlign="left">
          How to plan a lesson using our resources
        </OakHeading>
      }
      subheading={
        <>
          <br />
          <OakP $font={["body-2", "body-1"]} $textAlign="left">
            {`To help you plan your ${year.toLowerCase()} ${formatSubjectName(subject)} lesson on: ${lesson},`}{" "}
            <OakLink
              href={resolveOakHref({
                page: "lesson-downloads",
                lessonSlug,
                unitSlug,
                programmeSlug,
                downloads: "downloads",
              })}
            >
              download
            </OakLink>{" "}
            all teaching resources for free and adapt to suit your pupils'
            needs...
          </OakP>
        </>
      }
      initialOpen={false}
      id="lesson-overview-seo"
      $bt="border-solid-s"
      $bb="border-solid-s"
      $borderColor="border-neutral-lighter"
      $alignItems="flex-start"
    >
      <br />
      <OakP $font={["body-2", "body-1"]} $textAlign="left">
        {`To help you plan your ${year.toLowerCase()} ${formatSubjectName(subject)} lesson on: ${lesson},`}{" "}
        <OakLink
          href={resolveOakHref({
            page: "lesson-downloads",
            lessonSlug,
            unitSlug,
            programmeSlug,
            downloads: "downloads",
          })}
        >
          download
        </OakLink>{" "}
        all teaching resources for free and adapt to suit your pupils' needs.
      </OakP>
      <br />
      <OakP $font={["body-2", "body-1"]}>
        The starter quiz will activate and check your pupils' prior knowledge,
        with versions available both with and without answers in PDF format.
      </OakP>
      <br />
      <OakP $font={["body-2", "body-1"]}>
        We use learning cycles to break down learning into key concepts or ideas
        linked to the learning outcome. Each learning cycle features
        explanations with checks for understanding and practice tasks with
        feedback. All of this is found in our slide decks, ready for you to
        download and edit. The practice tasks are also available as printable
        worksheets and some lessons have additional materials with extra
        material you might need for teaching the lesson.
      </OakP>
      <br />
      <OakP $font={["body-2", "body-1"]}>
        The assessment exit quiz will test your pupils' understanding of the key
        learning points.
      </OakP>
      <br />
      <OakP $font={["body-2", "body-1"]}>
        Our video is a tool for planning, showing how other teachers might teach
        the lesson, offering helpful tips, modelled explanations and inspiration
        for your own delivery in the classroom.{" "}
        {!disablePupilLink && (
          <>
            {`Plus, you can set it as homework or revision for pupils and keep their learning on track by sharing an `}
            <OakLink
              href={resolveOakHref({
                page: "pupil-lesson-canonical",
                lessonSlug,
              })}
            >
              online pupil version
            </OakLink>
            {` of this lesson.`}
          </>
        )}
      </OakP>
      <br />
      <OakP $font={["body-2", "body-1"]}>
        Explore more{" "}
        <OakLink
          href={resolveOakHref({
            page: "unit-index",
            programmeSlug,
          })}
        >
          {keystage.toLowerCase()} {formatSubjectName(subject)}{" "}
        </OakLink>{" "}
        lessons from the{" "}
        <OakLink
          href={resolveOakHref({
            page: "lesson-index",
            programmeSlug,
            unitSlug,
          })}
        >
          {unit} unit
        </OakLink>
        , dive into the full{" "}
        {hideCurriculumLink ? (
          `${getPhase(year)} ${formatSubjectName(subject)} curriculum`
        ) : (
          <OakLink
            href={resolveOakHref({
              page: "curriculum-units",
              subjectPhaseSlug: getSubjectPhaseSlug({
                subject: linkSubject,
                phaseSlug: getPhase(year),
                examBoardSlug,
              }),
            })}
          >
            {getPhase(year)} {formatSubjectName(subject)} curriculum
          </OakLink>
        )}
        , or learn more about{" "}
        <OakLink href={resolveOakHref({ page: "lesson-planning" })}>
          lesson planning
        </OakLink>
        .
      </OakP>
      <br />
    </OakBasicAccordion>
  );
};
