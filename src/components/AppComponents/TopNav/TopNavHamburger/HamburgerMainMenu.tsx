import {
  OakBox,
  OakLI,
  OakPrimaryInvertedButton,
  OakIconName,
  OakIcon,
  OakFlex,
  OakHeading,
} from "@oaknational/oak-components";
import { useEffect } from "react";

import { TopNavProps } from "../TopNav";

import { SubmenuState, useHamburgerMenu } from "./TopNavHamburger";

import { TeachersBrowse } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

export function MainMenuContent(props: TopNavProps) {
  const { submenuOpen, prevSubmenu } = useHamburgerMenu();
  useEffect(() => {
    if (prevSubmenu) {
      const element = document.getElementById(prevSubmenu + "button");
      element?.focus();
    }
  }, [submenuOpen, prevSubmenu]);

  if (!props.teachers) return;
  return (
    <>
      <SubjectsSection {...props.teachers?.primary} />
      <SubjectsSection {...props.teachers?.secondary} />
      <MainMenuLink href={"/"} title="Curriculum" />
      <MainMenuButton title={"About us"} />
      <MainMenuButton title={"Guidance"} />
      <MainMenuLink href={"/"} title="Ai Experiments" iconName="external" />
    </>
  );
}

function SubjectsSection(props: TeachersBrowse) {
  return (
    <>
      <OakHeading tag="h2">{props.phaseTitle}</OakHeading>

      {props.keystages.map((keystage) => (
        <MainMenuButton
          key={keystage.slug + props.phaseSlug}
          title={keystage.title}
        />
      ))}
    </>
  );
}

function MainMenuButton({ title }: { title: string }) {
  const { setSubmenuOpen } = useHamburgerMenu();
  return (
    <OakBox $width={"100%"}>
      <OakLI $listStyle={"none"}>
        <OakFlex
          $justifyContent={"space-between"}
          $alignItems={"center"}
          $width={"100%"}
        >
          <OakPrimaryInvertedButton
            id={title + "button"}
            onClick={() => {
              setSubmenuOpen(title as SubmenuState);
            }}
          >
            {title}
          </OakPrimaryInvertedButton>
          <OakIcon iconName="chevron-right" />
        </OakFlex>
      </OakLI>
    </OakBox>
  );
}

function MainMenuLink({
  href,
  title,
  iconName,
}: {
  readonly href: string;
  readonly title: string;
  readonly iconName?: OakIconName;
}) {
  return (
    <OakPrimaryInvertedButton
      element="a"
      isTrailingIcon
      iconName={iconName}
      href={href}
    >
      {title}
    </OakPrimaryInvertedButton>
  );
}
