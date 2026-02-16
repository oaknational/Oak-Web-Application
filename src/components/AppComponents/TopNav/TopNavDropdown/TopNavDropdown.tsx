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

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import TopNavSubjectButtons from "./TopNavSubjectButtons";

import { resolveOakHref, ResolveOakHrefProps } from "@/common-lib/urls";
import {
  TeachersSubNavData,
  PupilsSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

export type TopNavDropdownProps = {
  focusManager:
    | DropdownFocusManager<TeachersSubNavData>
    | DropdownFocusManager<PupilsSubNavData>;
  activeArea: "TEACHERS" | "PUPILS";
  selectedMenu: keyof TeachersSubNavData | keyof PupilsSubNavData;
  teachers: TeachersSubNavData;
  pupils: PupilsSubNavData;
  onClose: () => void;
};

const TeachersPhaseSection = ({
  selectedMenu,
  menuData,
  focusManager,
  onClose,
}: {
  selectedMenu: keyof TeachersSubNavData;
  menuData: TeachersSubNavData["primary" | "secondary"];
  focusManager: DropdownFocusManager<TeachersSubNavData>;
  onClose: () => void;
}) => {
  const defaultKeystage =
    menuData.children[0]?.slug || (selectedMenu === "primary" ? "ks1" : "ks3");

  const [selectedKeystage, setSelectedKeystage] =
    useState<
      TeachersSubNavData["primary" | "secondary"]["children"][number]["slug"]
    >(defaultKeystage);

  useEffect(() => {
    setSelectedKeystage(defaultKeystage);
  }, [defaultKeystage]);

  const keystagesRef = useRef<HTMLUListElement>(null);

  const subjects =
    menuData.children
      .find((k) => k.slug === selectedKeystage)
      ?.children.filter((subject) => !subject.nonCurriculum) ?? undefined;
  const nonCurriculumSubjects =
    menuData.children
      .find((k) => k.slug === selectedKeystage)
      ?.children.filter((subject) => subject.nonCurriculum) ?? undefined;
  const onKeystageClick = (keystageSlug: string) => {
    setSelectedKeystage(keystageSlug);
  };

  // Arrow key navigation for up/down in keystages
  const handleKeystageArrowKeys = (
    event: React.KeyboardEvent<HTMLUListElement>,
  ) => {
    const focusableElements = menuData.children.map((keystage) =>
      focusManager.createId(`teachers-${menuData.slug}`, keystage.slug),
    );
    const activeElementId = document.activeElement?.id;
    if (!activeElementId) return;
    const currentIndex = focusableElements.indexOf(activeElementId);
    if (focusableElements.length === 0 || currentIndex === -1) return;
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        const nextIndex =
          currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1;
        focusableElements[nextIndex] &&
          document.getElementById(focusableElements[nextIndex])?.focus();
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const prevIndex =
          currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
        focusableElements[prevIndex] &&
          document.getElementById(focusableElements[prevIndex])?.focus();
        break;
      }
    }
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
        onKeyDown={handleKeystageArrowKeys}
      >
        {menuData.children.map((keystage) => {
          const buttonId = focusManager.createId(
            `teachers-${menuData.slug}`,
            keystage.slug,
          );
          return (
            <OakLI key={keystage.slug}>
              <OakLeftAlignedButton
                iconName="chevron-right"
                isTrailingIcon
                rightAlignIcon
                width={"spacing-160"}
                selected={selectedKeystage === keystage.slug}
                onClick={() => onKeystageClick(keystage.slug)}
                onKeyDown={(e) => focusManager.handleKeyDown(e, buttonId)}
                aria-current={
                  selectedKeystage === keystage.slug ? "true" : undefined
                }
                id={buttonId}
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
          );
        })}
      </OakUL>
      {subjects && (
        <TopNavSubjectButtons
          handleClick={onClose}
          focusManager={focusManager}
          selectedMenu={selectedMenu}
          subjects={subjects}
          nonCurriculumSubjects={nonCurriculumSubjects}
          keyStageSlug={selectedKeystage}
          keyStageTitle={
            menuData.children.find((k) => k.slug === selectedKeystage)?.title ||
            ""
          }
        />
      )}
    </OakFlex>
  );
};

const TeachersLinksSection = ({
  focusManager,
  selectedMenu,
  menuData,
  onClose,
}: {
  focusManager: DropdownFocusManager<TeachersSubNavData>;
  selectedMenu: "guidance" | "aboutUs";
  menuData: TeachersSubNavData["guidance" | "aboutUs"];
  onClose: () => void;
}) => {
  const sectionTitles = {
    guidance: "Guidance",
    aboutUs: "About us",
  };
  if (!menuData.children || menuData.children.length === 0) return null;
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
        {menuData.children.map((link) => {
          const buttonId = focusManager.createId(
            `teachers-${selectedMenu}`,
            link.slug,
          );
          return (
            <OakLI key={link.slug}>
              <OakLeftAlignedButton
                element={Link}
                key={link.slug}
                href={resolveOakHref({
                  page: link.slug,
                } as ResolveOakHrefProps)}
                iconName={link.external ? "external" : undefined}
                target={link.external ? "_blank" : undefined}
                isTrailingIcon={link.external}
                aria-label={
                  link.external
                    ? `${link.title} (opens in a new tab)`
                    : undefined
                }
                width={"spacing-160"}
                id={buttonId}
                onClick={onClose}
                onKeyDown={(e) => focusManager.handleKeyDown(e, buttonId)}
              >
                {link.title}
              </OakLeftAlignedButton>
            </OakLI>
          );
        })}
      </OakGrid>
    </OakFlex>
  );
};

const PupilsSection = ({
  selectedMenu,
  pupils,
  focusManager,
  onClose,
}: {
  selectedMenu: "primary" | "secondary";
  pupils: PupilsSubNavData;
  focusManager: DropdownFocusManager<PupilsSubNavData>;
  onClose: () => void;
}) => {
  const menuYears = pupils[selectedMenu].children;

  return (
    <OakUL
      $display={"flex"}
      $gap={"spacing-16"}
      $reset
      id={`topnav-pupils-${selectedMenu}`}
    >
      {menuYears.map((year) => {
        const buttonId = focusManager?.createId(
          `pupils-${selectedMenu}`,
          year.slug,
        );
        return (
          <OakLI key={year.slug}>
            <OakPupilJourneyYearButton
              phase={selectedMenu}
              key={year.slug}
              element={Link}
              href={resolveOakHref({
                page: "pupil-subject-index",
                yearSlug: year.slug,
              })}
              id={buttonId}
              onClick={onClose}
              onKeyDown={
                focusManager && buttonId
                  ? (e) => focusManager.handleKeyDown(e, buttonId)
                  : undefined
              }
            >
              {year.title}
            </OakPupilJourneyYearButton>
          </OakLI>
        );
      })}
    </OakUL>
  );
};

const TopNavDropdown = (props: TopNavDropdownProps) => {
  const { activeArea, selectedMenu, teachers, pupils, focusManager } = props;

  return (
    <OakFlex $pa={"spacing-40"}>
      {activeArea === "TEACHERS" &&
        (selectedMenu === "primary" || selectedMenu === "secondary") && (
          <TeachersPhaseSection
            focusManager={
              focusManager as DropdownFocusManager<TeachersSubNavData>
            }
            selectedMenu={selectedMenu}
            menuData={teachers[selectedMenu]}
            onClose={props.onClose}
          />
        )}
      {activeArea === "TEACHERS" &&
        (selectedMenu === "guidance" || selectedMenu === "aboutUs") && (
          <TeachersLinksSection
            focusManager={
              focusManager as DropdownFocusManager<TeachersSubNavData>
            }
            selectedMenu={selectedMenu}
            menuData={teachers[selectedMenu]}
            onClose={props.onClose}
          />
        )}
      {activeArea === "PUPILS" &&
        (selectedMenu === "primary" || selectedMenu === "secondary") && (
          <PupilsSection
            selectedMenu={selectedMenu}
            pupils={pupils}
            focusManager={
              focusManager as DropdownFocusManager<PupilsSubNavData>
            }
            onClose={props.onClose}
          />
        )}
    </OakFlex>
  );
};

export default TopNavDropdown;
