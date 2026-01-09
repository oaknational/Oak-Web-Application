import {
  OakBox,
  OakIconName,
  OakPrimaryInvertedButton,
  OakSubjectIconButton,
  OakUL,
} from "@oaknational/oak-components";
import { ReactNode } from "react";

import { SubmenuState, useHamburgerMenu } from "./TopNavHamburger";

import {
  SubNavLinks,
  TeachersBrowse,
  TeachersSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

export type NavItemData =
  | { type: "links"; links: SubNavLinks }
  | {
      type: "subjects";
      subjects: TeachersBrowse["keystages"][number]["subjects"];
      keystage: string;
      phase: "primary" | "secondary";
    };

export function SubmenuContainer({
  title,
  children,
}: {
  readonly title: SubmenuState;
  readonly children: ReactNode;
}) {
  const { submenuOpen, handleCloseSubmenu } = useHamburgerMenu();
  return (
    <OakBox $display={submenuOpen === title ? "block" : "none"}>
      <OakPrimaryInvertedButton
        iconName="chevron-left"
        selected={true}
        onClick={() => handleCloseSubmenu()}
      >
        {title}
      </OakPrimaryInvertedButton>
      {children}
    </OakBox>
  );
}

export function SubmenuContent(props: TeachersSubNavData) {
  const { submenuOpen } = useHamburgerMenu();

  if (!submenuOpen) return null;

  switch (submenuOpen) {
    case "About us":
      return (
        <SubmenuContainer title={submenuOpen}>
          <OakUL>
            {props.aboutUs.map((link) => (
              <OakBox key={link.slug} $width={"100%"}>
                <OakPrimaryInvertedButton element="a" href={`/${link.slug}`}>
                  {link.title}
                </OakPrimaryInvertedButton>
              </OakBox>
            ))}
          </OakUL>
        </SubmenuContainer>
      );

    case "Guidance":
      return (
        <SubmenuContainer title={submenuOpen}>
          <OakUL>
            {props.guidance.map((link) => (
              <OakBox key={link.slug} $width={"100%"}>
                <OakPrimaryInvertedButton element="a" href={`/${link.slug}`}>
                  {link.title}
                </OakPrimaryInvertedButton>
              </OakBox>
            ))}
          </OakUL>
        </SubmenuContainer>
      );

    default: {
      const phase = ["KS1", "KS2", "EYFS"].includes(submenuOpen)
        ? "primary"
        : "secondary";
      const phaseData = props[phase];
      const keystage = phaseData.keystages.find(
        (ks) => ks.title === submenuOpen,
      );

      if (!keystage) return null;

      return (
        <SubmenuContainer title={submenuOpen}>
          <OakUL>
            {keystage.subjects.map((subject) => (
              <OakBox key={subject.title + phase} $width={"100%"}>
                <OakSubjectIconButton
                  phase={phase}
                  subjectIconName={
                    ("subject-" + subject.subjectSlug) as OakIconName
                  }
                  variant="horizontal"
                >
                  {subject.title}
                </OakSubjectIconButton>
              </OakBox>
            ))}
          </OakUL>
        </SubmenuContainer>
      );
    }
  }
}
