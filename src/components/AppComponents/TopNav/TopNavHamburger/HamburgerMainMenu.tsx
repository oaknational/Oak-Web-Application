import { useEffect } from "react";
import {
  OakBox,
  OakLI,
  OakIconName,
  OakFlex,
  OakHeading,
  OakSvg,
  OakUL,
  OakLeftAlignedButton,
} from "@oaknational/oak-components";
import Link from "next/link";

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
    <OakUL
      $display={"flex"}
      $flexDirection={"column"}
      $pa={"spacing-40"}
      $gap={"spacing-40"}
    >
      <SubjectsSection {...props.teachers?.primary} />
      <SubjectsSection {...props.teachers?.secondary} />
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        <MainMenuLink href={"/"} title="Curriculum" />
        <MainMenuButton title={"About us"} />
        <MainMenuButton title={"Guidance"} />
        <MainMenuLink href={"/"} title="Ai Experiments" iconName="external" />
      </OakFlex>
    </OakUL>
  );
}

function SubjectsSection(props: TeachersBrowse) {
  return (
    <OakBox>
      <OakFlex
        $flexDirection={"column"}
        $width={"fit-content"}
        $mb={"spacing-12"}
      >
        <OakHeading tag="h2" $font={"heading-6"}>
          {props.phaseTitle}
        </OakHeading>
        <OakSvg
          $color={"mint"}
          $display={"block"}
          $width={"spacing-120"}
          name={"underline"}
          $height={"spacing-8"}
        />
      </OakFlex>
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        {props.keystages.map((keystage) => (
          <MainMenuButton
            key={keystage.slug + props.phaseSlug}
            title={keystage.title}
          />
        ))}
      </OakFlex>
    </OakBox>
  );
}

function MainMenuButton({ title }: { title: string }) {
  const { setSubmenuOpen } = useHamburgerMenu();
  return (
    <OakBox $width={"100%"}>
      <OakLI $listStyle={"none"}>
        <OakLeftAlignedButton
          rightAlignIcon
          iconName="chevron-right"
          width={"100%"}
          id={title + "button"}
          onClick={() => {
            setSubmenuOpen(title as SubmenuState);
          }}
        >
          {title}
        </OakLeftAlignedButton>
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
    <OakLeftAlignedButton
      width={"100%"}
      element={Link}
      isTrailingIcon
      iconName={iconName}
      href={href}
    >
      {title}
    </OakLeftAlignedButton>
  );
}
