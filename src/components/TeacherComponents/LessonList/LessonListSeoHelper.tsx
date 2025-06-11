import { OakBasicAccordion, OakBox, OakP } from "@/styles/oakThemeApp";

const getPhase = (year: string) => {
  return Number(year) < 7 ? "primary" : "secondary";
};

const formatSubjectName = (subject: string) => {
  const excludedSubjects = [
    "English",
    "French",
    "Spanish",
    "German",
    "RSHE (PSHE)",
  ];

  return excludedSubjects.includes(subject) ? subject : subject.toLowerCase();
};

export const LessonListSeoHelper = ({
  keystage,
  subject,
  unitTitle,
  year,
}: {
  keystage: string;
  subject: string;
  unitTitle: string;
  year: string;
}) => {
  return (
    <OakBox $mb="space-between-xxl">
      <OakBasicAccordion
        header={
          <OakP $font="body-1" $textAlign="left">
            Explore this {year.toLowerCase()} {formatSubjectName(subject)} unit
            to find free lesson teaching resources, including...
          </OakP>
        }
        initialOpen={false}
        id="lesson-list-seo"
        data-testid="lesson-list-seo-accordion"
        $bt="border-solid-s"
        $bb="border-solid-s"
        $borderColor="border-neutral-lighter"
        $alignItems="flex-start"
      >
        <OakP $font="body-1" $textAlign="left">
          slide decks, worksheet PDFs, quizzes and lesson overviews. You can
          select individual lessons from the {unitTitle} unit and download the
          resources you need, or download the entire unit now. See every unit
          listed in our {getPhase(year)} {formatSubjectName(subject)} curriculum
          and discover more of our teaching resources for{" "}
          {keystage.toUpperCase()}.
        </OakP>
      </OakBasicAccordion>
    </OakBox>
  );
};
