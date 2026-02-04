import { useEffect, useRef, useState } from "react";
import {
  OakBox,
  OakFlex,
  OakGrid,
  OakHeading,
  OakLeftAlignedButton,
  OakLI,
  OakPupilJourneyYearButton,
  OakSvg,
  OakUL,
} from "@oaknational/oak-components";
import Link from "next/link";

import { DropDownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import TopNavSubjectButtons from "./TopNavSubjectButtons";

import { resolveOakHref, ResolveOakHrefProps } from "@/common-lib/urls";
import {
  TeachersSubNavData,
  PupilsSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

export type TopNavDropdownProps = {
  focusManager: DropDownFocusManager;
  activeArea: "TEACHERS" | "PUPILS";
  selectedMenu: keyof TeachersSubNavData | keyof PupilsSubNavData;
  teachers: TeachersSubNavData;
  pupils: PupilsSubNavData;
};

const TeachersPhaseSection = ({
  selectedMenu,
  menuData,
  focusManager,
}: {
  selectedMenu: keyof TeachersSubNavData;
  menuData: TeachersSubNavData["primary" | "secondary"];
  focusManager: DropDownFocusManager;
}) => {
  const defaultKeystage =
    menuData.keystages[0]?.slug || (selectedMenu === "primary" ? "ks1" : "ks3");

  const [selectedKeystage, setSelectedKeystage] =
    useState<
      TeachersSubNavData["primary" | "secondary"]["keystages"][number]["slug"]
    >(defaultKeystage);

  useEffect(() => {
    setSelectedKeystage(defaultKeystage);
  }, [defaultKeystage]);

  const keystagesRef = useRef<HTMLUListElement>(null);

  const subjects =
    menuData.keystages
      .find((k) => k.slug === selectedKeystage)
      ?.subjects.filter((subject) => !subject.nonCurriculum) ?? undefined;
  const nonCurriculumSubjects =
    menuData.keystages
      .find((k) => k.slug === selectedKeystage)
      ?.subjects.filter((subject) => subject.nonCurriculum) ?? undefined;

  const onKeystageClick = (keystageSlug: string) => {
    setSelectedKeystage(keystageSlug);
  };

  return (
    <OakFlex $gap={"spacing-40"}>
      <OakUL
        $display={"flex"}
        $flexDirection={"column"}
        $gap={"spacing-8"}
        $pa={"spacing-0"}
        $reset
        id={`topnav-teachers-${selectedMenu}`}
        role="tablist"
        ref={keystagesRef}
      >
        {menuData.keystages.map((keystage) => (
          <OakLI key={keystage.slug}>
            <OakLeftAlignedButton
              iconName="chevron-right"
              isTrailingIcon
              rightAlignIcon
              width={"spacing-160"}
              selected={selectedKeystage === keystage.slug}
              onClick={() => onKeystageClick(keystage.slug)}
              onKeyDown={(e) =>
                focusManager.handleKeyDown(
                  e,
                  `${keystage.slug}-dropdown-button`,
                )
              }
              aria-current={
                selectedKeystage === keystage.slug ? "true" : undefined
              }
              id={`${keystage.slug}-dropdown-button`}
              aria-expanded={selectedKeystage === keystage.slug}
              aria-controls={`topnav-teachers-${keystage.slug}-subjects`}
              role="tab"
              aria-selected={selectedKeystage === keystage.slug}
              aria-label={
                keystage.title === "EYFS"
                  ? "Early years foundation stage"
                  : undefined
              }
            >
              {keystage.title.replace("KS", "Key stage ")}
            </OakLeftAlignedButton>
          </OakLI>
        ))}
      </OakUL>
      {subjects && (
        <TopNavSubjectButtons
          selectedMenu={selectedMenu}
          subjects={subjects}
          nonCurriculumSubjects={nonCurriculumSubjects}
          keyStageSlug={selectedKeystage}
          keyStageTitle={
            menuData.keystages.find((k) => k.slug === selectedKeystage)
              ?.title || ""
          }
        />
      )}
    </OakFlex>
  );
};

const TeachersLinksSection = ({
  selectedMenu,
  menuData,
}: {
  selectedMenu: "guidance" | "aboutUs";
  menuData: TeachersSubNavData["guidance" | "aboutUs"];
}) => {
  const sectionTitles = {
    guidance: "Guidance",
    aboutUs: "About us",
  };

  return (
    <OakFlex $flexDirection={"column"} $gap={"spacing-40"}>
      <OakBox $width={"fit-content"} $position={"relative"}>
        <OakHeading tag="h2">{sectionTitles[selectedMenu]}</OakHeading>
        <OakSvg
          $position={"absolute"}
          $color={"mint"}
          $height={"spacing-8"}
          name={"underline"}
        />
      </OakBox>
      <OakGrid
        as="ul"
        $gridTemplateColumns={["1fr 1fr 1fr"]}
        $cg={"spacing-40"}
        $rg={"spacing-8"}
        $pa={"spacing-0"}
        $ma={"spacing-0"}
        style={{ listStyleType: "none" }}
        id={`topnav-teachers-${selectedMenu}`}
      >
        {menuData.map((link) => (
          <OakLI key={link.slug}>
            <OakLeftAlignedButton
              element={Link}
              key={link.slug}
              href={resolveOakHref({
                page: link.slug,
              } as ResolveOakHrefProps)}
              iconName={link.external ? "external" : undefined}
              isTrailingIcon={link.external}
              aria-label={
                link.external ? `${link.title} (opens in a new tab)` : undefined
              }
              width={"spacing-160"}
              id={`${link.slug}-dropdown-button`}
            >
              {link.title}
            </OakLeftAlignedButton>
          </OakLI>
        ))}
      </OakGrid>
    </OakFlex>
  );
};

const PupilsSection = ({
  selectedMenu,
  pupils,
}: {
  selectedMenu: keyof PupilsSubNavData;
  pupils: PupilsSubNavData;
}) => {
  const menuYears = pupils[selectedMenu].years;

  return (
    <OakUL
      $display={"flex"}
      $gap={"spacing-16"}
      $reset
      id={`topnav-pupils-${selectedMenu}`}
    >
      {menuYears.map((year) => (
        <OakLI key={year.slug}>
          <OakPupilJourneyYearButton
            phase={selectedMenu}
            key={year.slug}
            element="a"
            href={resolveOakHref({
              page: "pupil-subject-index",
              yearSlug: year.slug,
            })}
            id={`topnav-pupils-${year.slug}`}
          >
            {year.title}
          </OakPupilJourneyYearButton>
        </OakLI>
      ))}
    </OakUL>
  );
};

const TopNavDropdown = (props: TopNavDropdownProps) => {
  const { activeArea, selectedMenu, teachers, pupils } = props;

  return (
    <OakFlex $pa={"spacing-40"}>
      {activeArea === "TEACHERS" &&
        (selectedMenu === "primary" || selectedMenu === "secondary") && (
          <TeachersPhaseSection
            focusManager={props.focusManager}
            selectedMenu={selectedMenu}
            menuData={teachers[selectedMenu]}
          />
        )}
      {activeArea === "TEACHERS" &&
        (selectedMenu === "guidance" || selectedMenu === "aboutUs") && (
          <TeachersLinksSection
            selectedMenu={selectedMenu}
            menuData={teachers[selectedMenu]}
          />
        )}
      {activeArea === "PUPILS" &&
        (selectedMenu === "primary" || selectedMenu === "secondary") && (
          <PupilsSection selectedMenu={selectedMenu} pupils={pupils} />
        )}
    </OakFlex>
  );
};

export default TopNavDropdown;
