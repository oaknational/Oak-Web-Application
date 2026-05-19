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

export type ExamBoardPanelProps = {
  examBoards: Array<{
    slug: string;
    title: string;
    programmeSlug: string;
  }>;
  selectedSubject: SubjectsNavItem;
  subjectParentTitle?: string;
  focusManager?: DropdownFocusManager<TeachersSubNavData>;
  onClick: (examBoardSlug: string, programmeSlug: string) => void;
  onClose: () => void;
};

const ExamBoardPanel = ({
  examBoards,
  selectedSubject,
  subjectParentTitle,
  focusManager,
  onClick,
  onClose,
}: ExamBoardPanelProps) => {
  const router = useRouter();
  if (!examBoards || examBoards.length === 0) {
    return null;
  }

  const navigateToSubject = ({ examBoardSlug }: { examBoardSlug: string }) => {
    const href = resolveOakHref({
      page: "unit-index",
      programmeSlug: getTeacherSubjectPhaseSlug({
        subjectSlug: subjectParentTitle || selectedSubject?.slug,
        phaseSlug: "secondary",
        examboardSlug: examBoardSlug,
        pathwaySlug: null,
        subjectParentTitle: selectedSubject?.subjectParent ?? undefined,
      }),
    });
    router.push(href);
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
