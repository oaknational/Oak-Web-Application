import { OakPrimaryButton } from "@oaknational/oak-components";
import Link from "next/link";

import { Header, LargeHeaderProps } from "../Header/Header";
import HeaderNavFooter from "../HeaderNavFooter/HeaderNavFooter";

import { NeighbourUnitOrLesson } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";
import { resolveOakHref } from "@/common-lib/urls";


type LessonHeaderProps = LargeHeaderProps & {
  currentLessonSlug: string;
  prevLesson: NeighbourUnitOrLesson;
  nextLesson: NeighbourUnitOrLesson;
  programmeSlug: string;
  unitSlug: string;
};

const LessonHeader = (props: LessonHeaderProps) => {
  const { prevLesson, nextLesson, unitSlug, programmeSlug, currentLessonSlug } =
    props;
  return (
    <>
      <Header {...props} />
      <HeaderNavFooter
        type="lesson"
        backgroundColorLevel={1}
        viewHref={resolveOakHref({
          page: "unit-page",
          unitSlug,
          subjectPhaseSlug: programmeSlug,
        })}
        prevHref={
          prevLesson
            ? resolveOakHref({
                page: "lesson-overview", // TD: update
                lessonSlug: prevLesson.slug,
                programmeSlug,
                unitSlug,
              })
            : undefined
        }
        nextHref={
          nextLesson
            ? resolveOakHref({
                page: "lesson-overview", // TD: update
                lessonSlug: nextLesson.slug,
                unitSlug,
                programmeSlug,
              })
            : undefined
        }
        actionButton={
          <OakPrimaryButton
            iconName="download"
            isTrailingIcon
            element={Link}
            href={resolveOakHref({
              page: "lesson-downloads",
              lessonSlug: currentLessonSlug,
              programmeSlug,
              unitSlug,
              downloads: "downloads",
              query: { preselected: "all" },
            })}
          >
            Download all resources
          </OakPrimaryButton>
        }
      />
    </>
  );
};

export default LessonHeader;
