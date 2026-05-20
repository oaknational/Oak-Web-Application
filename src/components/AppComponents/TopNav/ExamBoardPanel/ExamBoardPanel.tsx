import {
  OakBox,
  OakFlex,
  OakHeading,
  OakRadioAsButton,
  OakRadioGroup,
  OakUL,
} from "@oaknational/oak-components";
import { useRouter } from "next/navigation";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import {
  SubjectsNavItem,
  TeachersSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { convertUnitSlugToTitle } from "@/components/TeacherViews/Search/helpers";
import { resolveOakHref } from "@/common-lib/urls";
import { getTeacherSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import { filtersToQuery } from "@/utils/curriculum/filtering";

export type ExamBoardPanelProps = {
  examBoards: Array<{
    slug: string;
    title: string;
    programmeSlug: string;
  }>;
  selectedSubject: SubjectsNavItem;
  focusManager?: DropdownFocusManager<TeachersSubNavData>;
  onClick: (examBoardSlug: string, programmeSlug: string) => void;
  onClose: () => void;
};

const ExamBoardPanel = ({
  examBoards,
  selectedSubject,
  focusManager,
  onClick,
  onClose,
}: ExamBoardPanelProps) => {
  const router = useRouter();

  const getQueryParams = (hasParentSubject: boolean) =>
    new URLSearchParams(
      filtersToQuery(
        {
          childSubjects: hasParentSubject ? [selectedSubject.slug] : [],
          years: [],
          subjectCategories: [],
          tiers: [],
          threads: [],
          pathways: [],
          keystages: ["ks4"],
        },
        {
          childSubjects: [],
          years: [],
          subjectCategories: [],
          tiers: [],
          threads: [],
          pathways: [],
          keystages: [],
        },
      ),
    ).toString();

  if (!examBoards || examBoards.length === 0) {
    return null;
  }

  const navigateToSubject = ({ examBoardSlug }: { examBoardSlug: string }) => {
    if (examBoardSlug === null) return;
    const href = resolveOakHref({
      page: "unit-index",
      programmeSlug: getTeacherSubjectPhaseSlug({
        subjectSlug: selectedSubject?.slug,
        phaseSlug: "secondary",
        examboardSlug: examBoardSlug,
        pathwaySlug: null,
        subjectParentTitle: selectedSubject?.subjectParent ?? undefined,
      }),
    });
    const queryParams = getQueryParams(Boolean(selectedSubject.subjectParent));

    router.push(queryParams ? `${href}?${queryParams}` : href);

    onClick(selectedSubject.slug, "ks4");
    onClose();
  };

  return (
    <OakFlex $flexDirection={"column"}>
      <OakBox $width={"fit-content"} $position={"relative"}>
        <OakHeading
          $font={"heading-7"}
          tag="h6"
          $mt={"spacing-0"}
          $mb={"spacing-16"}
        >
          Choose exam board for KS4{" "}
          {convertUnitSlugToTitle(selectedSubject.slug, false)}
        </OakHeading>
      </OakBox>
      <OakUL
        $display={"flex"}
        $flexDirection={"column"}
        $gap={"spacing-8"}
        $reset
        id={`topnav-teachers-ks4-examboards-${selectedSubject.slug}`}
        role="list"
      >
        <OakRadioGroup
          name={`exam-boards-${selectedSubject.slug}`}
          onChange={(e) => navigateToSubject({ examBoardSlug: e.target.value })}
          value={selectedSubject.slug}
          $gap="spacing-12"
        >
          {examBoards.map((examBoard) => {
            const buttonId = focusManager?.createId(
              `teachers-ks4-examboard`,
              `${selectedSubject.slug}-${examBoard.slug}`,
            );

            return (
              <OakRadioAsButton
                key={buttonId}
                colorScheme="primary"
                displayValue={examBoard.title}
                value={examBoard.slug}
                width={"fit-content"}
              />
            );
          })}
        </OakRadioGroup>
      </OakUL>
    </OakFlex>
  );
};

export default ExamBoardPanel;
