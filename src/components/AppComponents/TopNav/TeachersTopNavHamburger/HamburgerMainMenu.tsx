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

import {
  getEYFSAriaLabel,
  SubmenuState,
  useHamburgerMenu,
} from "./TeachersTopNavHamburger";

import {
  TeachersBrowse,
  TeachersSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { resolveOakHref } from "@/common-lib/urls";

export function MainMenuContent(props: Readonly<TeachersSubNavData>) {
  const { submenuOpen, prevSubmenu } = useHamburgerMenu();
  useEffect(() => {
    if (prevSubmenu) {
      const element = document.getElementById(prevSubmenu + "button");
      element?.focus();
    }
  }, [submenuOpen, prevSubmenu]);

  return (
    <OakUL
      $display={"flex"}
      $flexDirection={"column"}
      $pa={"spacing-40"}
      $gap={"spacing-40"}
    >
      <SubjectsSection {...props.primary} />
      <SubjectsSection {...props.secondary} />
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        <MainMenuLink
          href={resolveOakHref({
            page: "curriculum-landing-page",
          })}
          title="Curriculum"
        />
        <MainMenuButton title={"About us"} />
        <MainMenuButton title={"Guidance"} />
        <MainMenuLink
          href={resolveOakHref({
            page: "labs",
          })}
          title="AI Experiments"
          iconName="external"
        />
      </OakFlex>
    </OakUL>
  );
}

function SubjectsSection(props: Readonly<TeachersBrowse>) {
  return (
    <OakBox>
      <OakFlex
        $flexDirection={"column"}
        $width={"fit-content"}
        $mb={"spacing-12"}
      >
        <OakBox $position={"relative"}>
          <OakHeading tag="h2" $font={"heading-6"}>
            {props.phaseTitle}
          </OakHeading>
          <OakSvg
            $position={"absolute"}
            $color={"mint"}
            $display={"block"}
            name={"underline"}
            $height={"spacing-8"}
          />
        </OakBox>
      </OakFlex>
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        {props.keystages.map((keystage) => (
          <MainMenuButton
            key={keystage.slug + props.phaseSlug}
            title={keystage.title as SubmenuState}
            description={keystage.description}
          />
        ))}
      </OakFlex>
    </OakBox>
  );
}

function MainMenuButton({
  title,
  description,
}: {
  readonly title: SubmenuState;
  readonly description?: string;
}) {
  const { setSubmenuOpen } = useHamburgerMenu();
  const isEYFS = title === "EYFS";
  const showDescription = !isEYFS && description;
  return (
    <OakBox $width={"100%"}>
      <OakLI $listStyle={"none"}>
        <OakLeftAlignedButton
          aria-haspopup={true}
          aria-label={getEYFSAriaLabel(title)}
          rightAlignIcon
          iconName="chevron-right"
          width={"100%"}
          id={title + "button"}
          onClick={() => {
            setSubmenuOpen(title);
          }}
        >
          {showDescription ? description : title}
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
