import {
  OakBox,
  OakPrimaryInvertedButton,
  OakUL,
  OakLI,
  OakSecondaryLink,
  OakSubjectIconButton,
  OakIconName,
} from "@oaknational/oak-components";
import { ReactNode } from "react";

import { SubmenuState, useHamburgerMenu } from "./TopNavHamburger";

import {
  SubNavLinks,
  TeachersBrowse,
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
  const { submenuOpen, setSubmenuOpen } = useHamburgerMenu();
  return (
    <OakBox
      $display={submenuOpen === title ? "block" : "none"}
      $position={"absolute"}
      $top={"spacing-0"}
      $left={"spacing-0"}
      $zIndex={"modal-dialog"}
    >
      <OakPrimaryInvertedButton
        iconName="chevron-left"
        selected={true}
        onClick={() => {
          setSubmenuOpen(false);
        }}
      >
        {title}
      </OakPrimaryInvertedButton>
      <OakUL>{children}</OakUL>
    </OakBox>
  );
}

export function SubmenuContent({
  title,
  data,
}: {
  readonly title: SubmenuState;
  readonly data: NavItemData;
}) {
  const { handleClose } = useHamburgerMenu();
  return (
    <>
      {data.type === "links" && (
        <>
          {data.links.map((link) => (
            <OakLI $listStyle={"none"} key={title + link.slug}>
              <OakSecondaryLink href={link.slug}>{link.title}</OakSecondaryLink>
            </OakLI>
          ))}
        </>
      )}
      {data.type === "subjects" && (
        <>
          {data.subjects.map((s) => (
            <OakLI
              $listStyle={"none"}
              key={s.title + data.keystage + data.phase}
            >
              <OakSubjectIconButton
                phase={data.phase}
                variant="horizontal"
                subjectIconName={("subject-" + s.subjectSlug) as OakIconName}
                onClick={() => {
                  handleClose();
                }}
              >
                {s.title}
              </OakSubjectIconButton>
            </OakLI>
          ))}
        </>
      )}
    </>
  );
}
