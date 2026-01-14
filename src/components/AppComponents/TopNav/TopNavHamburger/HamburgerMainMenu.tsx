import { useEffect } from "react";

import { TopNavProps } from "../TopNav";

import { SubmenuState, useHamburgerMenu } from "./TopNavHamburger";

import {
  OakBox,
  OakLI,
  OakSmallPrimaryInvertedButton,
  OakIconName,
  OakIcon,
  OakFlex,
  OakHeading,
  OakSvg,
  OakUL,
  OakPrimaryInvertedButton,
} from "@oaknational/oak-components";
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
    <OakUL
      $display={"flex"}
      $flexDirection={"column"}
      $pa={"spacing-40"}
      $gap={"spacing-40"}
    >
      <SubjectsSection {...props.teachers?.primary} />
      <SubjectsSection {...props.teachers?.secondary} />
      <OakBox>
        <MainMenuLink href={"/"} title="Curriculum" />
        <MainMenuButton title={"About us"} />
        <MainMenuButton title={"Guidance"} />
        <MainMenuLink href={"/"} title="Ai Experiments" iconName="external" />
      </OakBox>
    </OakUL>
  );
}

function SubjectsSection(props: TeachersBrowse) {
  return (
    <OakBox>
      <OakFlex $flexDirection={"column"} $width={"fit-content"}>
        <OakHeading tag="h2">{props.phaseTitle}</OakHeading>
        <OakSvg
          $color={"mint"}
          $display={"block"}
          $width={"spacing-120"}
          name={"underline"}
          $height={"spacing-8"}
        />
      </OakFlex>
      {props.keystages.map((keystage) => (
        <MainMenuButton
          key={keystage.slug + props.phaseSlug}
          title={keystage.title}
        />
      ))}
    </OakBox>
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
          <OakSmallPrimaryInvertedButton
            width={"100%"}
            id={title + "button"}
            onClick={() => {
              setSubmenuOpen(title as SubmenuState);
            }}
          >
            {title}
          </OakSmallPrimaryInvertedButton>
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
