import {
  OakLI,
  OakSubjectIconButton,
  OakUL,
} from "@oaknational/oak-components";
import Link from "next/link";
import React from "react";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";
import { MaybeVisuallyHidden } from "../TopNav";
import { getKs4OptionButtonId } from "../DropdownFocusManager/helpers";

import { TopNavDropdownProps } from "./TopNavDropdown";
import { TopNavKS4Buttons } from "./TopNavKS4Buttons";

import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import {
  TeachersSubNavData as TeachersData,
  SubjectsMenu,
  PhaseSlug,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { KeystageSlug } from "@/node-lib/curriculum-api-2023/shared.schema";

const TopNavSubjectButtons = ({
  selectedMenu,
  subjects,
  selectedSubject,
  handleClick,
  focusManager,
  phase,
  identifyingSlug,
  onExamBoardPanelOpen,
  onExamboardPanelClose,
  getButtonId,
}: {
  selectedMenu?: TopNavDropdownProps["selectedMenu"];
  phase: PhaseSlug;
  subjects: SubjectsMenu[] | null;
  selectedSubject: SubjectsMenu | null;
  identifyingSlug: KeystageSlug | PhaseSlug;
  handleClick: (subject: SubjectsMenu, keystage: string) => void;
  focusManager?: DropdownFocusManager<TeachersData>;
  onExamBoardPanelOpen: (subject: SubjectsMenu) => void;
  onExamboardPanelClose: () => void;
  getButtonId: (key: string) => string | null | undefined;
}) => {
  const handleSubjectClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    subject: SubjectsMenu,
  ) => {
    if (subject.children && subject.children.length > 0) {
      e.preventDefault();
      onExamBoardPanelOpen?.(subject);
      return;
    }
    handleClick(subject, identifyingSlug);
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
        id={`topnav-teachers-${identifyingSlug}-subjects`}
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

            const buttonId = getButtonId(key);

            if (!buttonId) return null;

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
                    if (e.key === "Enter" && children?.length) {
                      e.preventDefault();
                      onExamBoardPanelOpen?.(subject);
                      return;
                    }
                    if (buttonId) {
                      focusManager?.handleTabKeyDown(e, buttonId);
                    }
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
      {subjects?.map((subject) => {
        if (!subject.children || subject.children.length === 0) return null;

        return (
          <MaybeVisuallyHidden
            shouldDisplay={selectedSubject === subject}
            hiddenElementId={`teachers-examboards-${subject.slug}`}
            key={subject.slug}
          >
            <TopNavKS4Buttons
              ks4Options={subject.children}
              subject={subject}
              focusManager={focusManager}
              onClick={handleClick}
              onExamboardPanelClose={onExamboardPanelClose}
              getButtonId={(slug) =>
                getKs4OptionButtonId({
                  focusManager,
                  slug,
                  subjectSlug: subject.slug,
                  identifyingSlug,
                  phase: "secondary",
                })
              }
            />
          </MaybeVisuallyHidden>
        );
      })}
    </>
  );
};

export default TopNavSubjectButtons;
