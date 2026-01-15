import { ReactNode } from "react";
import {
  OakBox,
  OakFlex,
  OakPrimaryInvertedButton,
  OakSubjectIconButton,
  OakUL,
 OakLeftAlignedButton } from "@oaknational/oak-components";
import Link from "next/link";

import { SubmenuState, useHamburgerMenu } from "./TopNavHamburger";

import {
  SubNavLinks,
  TeachersBrowse,
  TeachersSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { resolveOakHref } from "@/common-lib/urls";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";


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
    <OakFlex
      $ph={"spacing-40"}
      $pb={"spacing-40"}
      $gap={"spacing-40"}
      $flexDirection={"column"}
      $display={submenuOpen === title ? "flex" : "none"}
    >
      <OakPrimaryInvertedButton
        iconName="chevron-left"
        selected={true}
        onClick={() => handleCloseSubmenu()}
      >
        {title}
      </OakPrimaryInvertedButton>

      {children}
    </OakFlex>
  );
}

export function SubmenuContent(props: TeachersSubNavData) {
  const { submenuOpen, handleClose } = useHamburgerMenu();

  if (!submenuOpen) return null;

  switch (submenuOpen) {
    case "About us":
      console.log(props.aboutUs);
      return (
        <SubmenuContainer title={submenuOpen}>
          <OakUL
            $display={"flex"}
            $flexDirection={"column"}
            $gap={"spacing-16"}
          >
            {props.aboutUs.map((link) => (
              <OakBox key={link.slug}>
                <OakLeftAlignedButton
                  onClick={() => {
                    handleClose();
                  }}
                  element={Link}
                  href={`/${link.slug}`}
                >
                  {link.title}
                </OakLeftAlignedButton>
              </OakBox>
            ))}
          </OakUL>
        </SubmenuContainer>
      );

    case "Guidance":
      return (
        <SubmenuContainer title={submenuOpen}>
          <OakUL
            $display={"flex"}
            $flexDirection={"column"}
            $gap={"spacing-16"}
          >
            {props.guidance.map((link) => (
              <OakBox key={link.slug}>
                <OakLeftAlignedButton
                  onClick={() => {
                    handleClose();
                  }}
                  element="a"
                  href={`/${link.slug}`}
                >
                  {link.title}
                </OakLeftAlignedButton>
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
          <OakUL
            $ph={"spacing-0"}
            $display={"flex"}
            $flexDirection={"row"}
            $flexWrap={"wrap"}
            $gap={"spacing-16"}
          >
            {keystage.subjects
              .toSorted((a, b) => {
                const aNon = !!a.nonCurriculum;
                const bNon = !!b.nonCurriculum;
                if (aNon === bNon) return a.title.localeCompare(b.title);
                return aNon ? 1 : -1;
              })
              .map((subject) => (
                <OakBox key={subject.title + phase}>
                  <OakSubjectIconButton
                    element="a"
                    // href={resolveOakHref({
                    //   page: "unit-index",
                    //   programmeSlug: subject.programmeSlug,
                    // })}
                    onClick={() => {
                      handleClose();
                    }}
                    phase={subject.nonCurriculum ? "non-curriculum" : phase}
                    subjectIconName={getValidSubjectIconName(
                      subject.subjectSlug,
                    )}
                    variant="horizontal"
                  >
                    {subject.title}
                  </OakSubjectIconButton>
                </OakBox>
              ))}
            <OakBox $width={"100%"}>
              <OakPrimaryInvertedButton
                element="a"
                href={resolveOakHref({
                  page: "subject-index",
                  keyStageSlug: keystage.slug,
                })}
                onClick={() => {
                  handleClose();
                }}
                isTrailingIcon
                iconName="arrow-right"
              >
                {`All ${keystage.title} subjects`}
              </OakPrimaryInvertedButton>
            </OakBox>
          </OakUL>
        </SubmenuContainer>
      );
    }
  }
}
