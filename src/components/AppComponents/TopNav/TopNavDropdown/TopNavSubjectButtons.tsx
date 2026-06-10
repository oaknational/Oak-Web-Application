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
  SubjectsMenu,
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
  subjects: SubjectsMenu[] | null;
  selectedSubject: SubjectsMenu | null;
  keyStageSlug: string;
  handleClick: (subject: SubjectsMenu, keystage: string) => void;
  focusManager?: DropdownFocusManager<TeachersData>;
  onExamBoardPanelOpen?: (subject: SubjectsMenu) => void;
  onExamboardPanelClose?: () => void;
}) => {
  const handleSubjectClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    subject: SubjectsMenu,
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

    handleClick(subject, keyStageSlug);
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
            const {
              slug: key,
              title,
              children,
              nonCurriculum,
              href,
              subjectSlug,
            } = subject;

            const buttonId = focusManager?.createId(
              `teachers-${phase}-${keyStageSlug}`,
              key,
            );

            return (
              <OakLI key={title}>
                <OakSubjectIconButton
                  variant={"horizontal"}
                  element={children?.length ? "button" : Link}
                  data-testid={`topnav-subject-button-${key}`}
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
