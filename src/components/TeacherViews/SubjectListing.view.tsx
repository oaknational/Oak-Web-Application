import { FC } from "react";
import {
  OakHeading,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakP,
  OakHandDrawnHR,
  OakMaxWidth,
} from "@oaknational/oak-components";

import OwaLink from "../SharedComponents/OwaLink";
import { SubjectKeystageSeoText } from "../TeacherComponents/SubjectKeystageSEO/SubjectKeystageSeoText";
import { SubjectKeystageSeoAccordion } from "../TeacherComponents/SubjectKeystageSEO/SubjectKeystageSeoAccordion";

import { SubjectListingPageProps } from "@/pages/teachers/key-stages/[keyStageSlug]/subjects";
import SubjectListingCardDouble from "@/components/TeacherComponents/SubjectListingCard";

const SubjectListingPage: FC<SubjectListingPageProps> = (props) => {
  const { subjects, keyStageSlug, keyStageTitle } = props;

  const isEyfs = keyStageSlug === "early-years-foundation-stage";
  const sentenceCaseKeyStageTitle =
    keyStageTitle.charAt(0).toUpperCase() +
    keyStageTitle.slice(1).toLowerCase();

  const title = isEyfs
    ? `EYFS areas of learning`
    : `${sentenceCaseKeyStageTitle} subjects`;

  const furtherLessons = subjects.filter(
    (subject) => subject[0]?.data?.features?.non_curriculum,
  );

  return (
    <OakFlex $flexDirection={"column"}>
      <OakMaxWidth
        $maxWidth={["spacing-480", "spacing-960", "spacing-1280"]}
        $ph="spacing-12"
      >
        <OakFlex
          $flexDirection="column"
          $gap={"spacing-16"}
          $mb={isEyfs ? "spacing-24" : "spacing-32"}
          $maxWidth={"spacing-960"}
        >
          <OakHeading
            $font={"heading-3"}
            tag={"h1"}
            $mt={["spacing-32", "spacing-48"]}
          >
            {title}
          </OakHeading>
          {isEyfs ? (
            <OakP $font="heading-light-7">
              These teaching resources were made during the pandemic for parents
              to use at home with their children. Now they are used by teachers
              as inspiration for their own lesson planning. Learn about the
              evolution of our EYFS curriculum and how to use it in your
              classroom. Visit our blog to learn more{" "}
              <OwaLink
                href="https://www.thenational.academy/blog/oaks-approach-to-eyfs"
                aria-label="eyfs-at-oak-blog"
                page={null}
              >
                here
              </OwaLink>
              .
            </OakP>
          ) : (
            <SubjectKeystageSeoText keystageSlug={keyStageSlug} />
          )}
        </OakFlex>
        <OakGrid
          $rg={"spacing-16"}
          $cg={"spacing-16"}
          $gridAutoRows={"1fr"}
          $mb={"spacing-72"}
        >
          {subjects.map(
            (subjectArray, i) =>
              subjectArray[0] &&
              !subjectArray[0].data?.features?.non_curriculum && (
                <OakGridArea
                  key={`subject-list-item-${subjectArray[0]?.slug}-${i}`}
                  $colSpan={[12, 6, 3]}
                >
                  <SubjectListingCardDouble
                    subject={subjectArray}
                    subjectSlug={subjectArray[0].slug}
                    keyStageSlug={keyStageSlug}
                    keyStageTitle={sentenceCaseKeyStageTitle}
                  />
                </OakGridArea>
              ),
          )}
        </OakGrid>
        {furtherLessons.length > 0 && (
          <>
            <OakHandDrawnHR
              hrColor={"bg-neutral-stronger"}
              $height={"spacing-4"}
            />
            <OakHeading
              $font={"heading-3"}
              tag={"h1"}
              $mv={["spacing-32", "spacing-24"]}
            >
              Further lessons
            </OakHeading>
            <OakGrid
              $rg={"spacing-16"}
              $cg={"spacing-16"}
              $gridAutoRows={"1fr"}
              $mb={"spacing-72"}
            >
              {furtherLessons.map((subject) => (
                <OakGridArea
                  key={`subject-list-item-${subject[0]?.slug}`}
                  $colSpan={[12, 6, 3]}
                >
                  <SubjectListingCardDouble
                    subject={subject}
                    subjectSlug={subject[0].slug}
                    keyStageSlug={keyStageSlug}
                    keyStageTitle={sentenceCaseKeyStageTitle}
                    $background="mint50"
                  />
                </OakGridArea>
              ))}
            </OakGrid>
          </>
        )}
        {!isEyfs && <SubjectKeystageSeoAccordion keystageSlug={keyStageSlug} />}
      </OakMaxWidth>
    </OakFlex>
  );
};

export default SubjectListingPage;
