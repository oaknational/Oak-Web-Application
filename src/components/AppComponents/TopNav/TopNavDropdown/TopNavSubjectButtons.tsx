import {
  OakLI,
  OakSubjectIconButton,
  OakUL,
} from "@oaknational/oak-components";
import Link from "next/link";
import React from "react";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";
import { MaybeVisuallyHidden } from "../TopNav";

import { TopNavDropdownProps } from "./TopNavDropdown";
import { TopNavKS4Buttons } from "./TopNavKS4Buttons";

import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import {
  TeachersSubNavData as TeachersData,
  TeachersBrowse,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

const TopNavSubjectButtons = ({
  selectedMenu,
  subjects,
  selectedSubject,
  keyStageSlug,
  handleClick,
  focusManager,
  phase,
  onExamBoardPanelOpen,
  onExamboardPanelClose,
}: {
  selectedMenu?: TopNavDropdownProps["selectedMenu"];
  phase: string;
  subjects: TeachersBrowse[] | null;
  selectedSubject: TeachersBrowse | null;
  keyStageSlug: string;
  handleClick: (subject: string, keystage: string) => void;
  focusManager?: DropdownFocusManager<TeachersData>;
  onExamBoardPanelOpen?: (subject: TeachersBrowse) => void;
  onExamboardPanelClose?: () => void;
}) => {
  const handleSubjectClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    subject: TeachersBrowse,
  ) => {
    if (
      keyStageSlug === "ks4" &&
      subject.children &&
      subject.children.length > 0
    ) {
      e.preventDefault();
      onExamBoardPanelOpen?.(subject);
      return;
    }

    handleClick(subject.slug, keyStageSlug);
  };

  return (
    <>
      <OakUL
        $display={"flex"}
        $flexGrow={1}
        $flexWrap={"wrap"}
        $alignContent={"baseline"}
        $gap={"spacing-16"}
        $reset
        id={`topnav-teachers-${keyStageSlug}-subjects`}
      >
        {subjects &&
          subjects.length > 0 &&
          subjects.map((subject) => {
            const { slug, navItemProps, title, children } = subject;
            if (navItemProps.type !== "subjectNavItem") return null;
            const { nonCurriculum, href, subjectSlug } = navItemProps;
            const buttonId = focusManager?.createId(
              `teachers-${phase}-${keyStageSlug}`,
              slug,
            );

            return (
              <OakLI key={title}>
                <OakSubjectIconButton
                  variant={"horizontal"}
                  element={children?.length ? "button" : Link}
                  data-testid={`topnav-subject-button-${slug}`}
                  subjectIconName={getValidSubjectIconName(subjectSlug)}
                  selected={selectedSubject?.title === title}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleSubjectClick(e, subject)
                  }
                  href={href}
                  onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                    if (
                      e.key === "Enter" &&
                      keyStageSlug === "ks4" &&
                      children?.length
                    ) {
                      e.preventDefault();
                      onExamBoardPanelOpen?.(subject);

                      return;
                    }
                    focusManager?.handleTabKeyDown(e, buttonId!);
                  }}
                  phase={
                    nonCurriculum
                      ? "non-curriculum"
                      : (selectedMenu as "primary" | "secondary")
                  }
                  id={buttonId}
                  aria-disabled={selectedMenu !== phase}
                >
                  {title}
                </OakSubjectIconButton>
              </OakLI>
            );
          })}
      </OakUL>
      {subjects?.map(
        (subject) =>
          subject.children?.length && (
            <MaybeVisuallyHidden
              shouldDisplay={selectedSubject === subject}
              hiddenElementId={`teachers-examboards-${subject.slug}`}
              key={subject.slug}
            >
              <TopNavKS4Buttons
                ks4Options={subject.children}
                selectedSubject={selectedSubject}
                parentId={`teachers-${phase}-${keyStageSlug}-${subject.slug}`}
                focusManager={focusManager}
                onExamboardPanelClose={onExamboardPanelClose}
              />
            </MaybeVisuallyHidden>
          ),
      )}
    </>
  );
};

export default TopNavSubjectButtons;
