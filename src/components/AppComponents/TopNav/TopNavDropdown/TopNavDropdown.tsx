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
import { MaybeVisuallyHidden } from "../TopNav";

import TopNavSubjectButtons from "./TopNavSubjectButtons";

import { resolveOakHref, ResolveOakHrefProps } from "@/common-lib/urls";
import {
  TeachersSubNavData,
  PupilsSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import useAnalytics from "@/context/Analytics/useAnalytics";

export type TopNavDropdownProps = {
  focusManager:
    | DropdownFocusManager<TeachersSubNavData>
    | DropdownFocusManager<PupilsSubNavData>
    | undefined;
  activeArea: "TEACHERS" | "PUPILS";
  selectedMenu?: keyof TeachersSubNavData | keyof PupilsSubNavData;
  teachers: TeachersSubNavData;
  pupils: PupilsSubNavData;
  onClose: () => void;
};

const TeachersPhaseSection = ({
  teachersData,
  selectedMenu,
  focusManager,
  onClick,
}: {
  teachersData: Pick<TeachersSubNavData, "primary" | "secondary">;
  selectedMenu?: "primary" | "secondary";
  focusManager: DropdownFocusManager<TeachersSubNavData>;
  onClick: (subject: string, keystage: string) => void;
}) => {
  const { track } = useAnalytics();
  const defaultKeystage = selectedMenu
    ? teachersData[selectedMenu].children[0]?.slug ||
      (selectedMenu === "primary" ? "ks1" : "ks3")
    : undefined;

  const [selectedKeystage, setSelectedKeystage] = useState<
    | TeachersSubNavData["primary" | "secondary"]["children"][number]["slug"]
    | undefined
  >(defaultKeystage);

  useEffect(() => {
    setSelectedKeystage(defaultKeystage);
  }, [defaultKeystage]);

  const keystagesRef = useRef<HTMLUListElement>(null);

  const onKeystageClick = (keystageSlug: string) => {
    track.browseRefined({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "refine",
      componentType: "topnav-browse-button",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      filterType: "Key stage filter",
      filterValue: keystageSlug,
      activeFilters: {},
      googleLoginHint: null,
      clientEnvironment: null,
    });
    setSelectedKeystage(keystageSlug);
  };

  // Arrow key navigation for up/down in keystages
  const handleKeystageArrowKeys = (
    event: React.KeyboardEvent<HTMLUListElement>,
  ) => {
    if (!selectedMenu) return;
    const menuData = teachersData[selectedMenu];
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

  const isKeystageOpen = (slug: string) => selectedKeystage === slug;
  return ["primary" as const, "secondary" as const].map((phase) => (
    <MaybeVisuallyHidden
      key={phase}
      hiddenElementId="teachers-keystage-section"
      shouldDisplay={selectedMenu === phase}
    >
      <OakFlex $gap={"spacing-40"}>
        <OakUL
          $display={"flex"}
          $flexDirection={"column"}
          $gap={"spacing-8"}
          $pa={"spacing-0"}
          $reset
          id={`topnav-teachers-${phase}`}
          role="tablist"
          ref={keystagesRef}
          onKeyDown={handleKeystageArrowKeys}
        >
          {teachersData[phase].children.map((keystage) => {
            const buttonId = focusManager.createId(
              `teachers-${teachersData[phase].slug}`,
              keystage.slug,
            );
            return (
              <OakLI key={keystage.slug}>
                <OakLeftAlignedButton
                  iconName="chevron-right"
                  isTrailingIcon
                  rightAlignIcon
                  width={"spacing-160"}
                  selected={isKeystageOpen(keystage.slug)}
                  onClick={() => onKeystageClick(keystage.slug)}
                  onKeyDown={(e) => focusManager.handleKeyDown(e, buttonId)}
                  aria-current={
                    isKeystageOpen(keystage.slug) ? "true" : undefined
                  }
                  id={buttonId}
                  aria-expanded={isKeystageOpen(keystage.slug)}
                  aria-controls={
                    isKeystageOpen(keystage.slug)
                      ? `topnav-teachers-${keystage.slug}-subjects`
                      : undefined
                  }
                  role="tab"
                  aria-selected={isKeystageOpen(keystage.slug)}
                  aria-label={
                    keystage.title === "EYFS"
                      ? "Early years foundation stage"
                      : undefined
                  }
                  aria-disabled={selectedMenu !== phase}
                >
                  {keystage.title.replace("KS", "Key stage ")}
                </OakLeftAlignedButton>
              </OakLI>
            );
          })}
        </OakUL>
        {teachersData[phase].children.map((keystage) => (
          <MaybeVisuallyHidden
            key={keystage.slug}
            hiddenElementId="teachers-subjects-section"
            shouldDisplay={keystage.slug === selectedKeystage}
          >
            <TopNavSubjectButtons
              handleClick={onClick}
              focusManager={focusManager}
              phase={phase}
              selectedMenu={selectedMenu}
              subjects={keystage.children}
              keyStageSlug={keystage.slug}
            />
          </MaybeVisuallyHidden>
        ))}
      </OakFlex>
    </MaybeVisuallyHidden>
  ));
};

const TeachersLinksSection = ({
  focusManager,
  selectedMenu,
  teachersData,
  onClose,
}: {
  focusManager: DropdownFocusManager<TeachersSubNavData>;
  selectedMenu?: "guidance" | "aboutUs";
  teachersData: Pick<TeachersSubNavData, "guidance" | "aboutUs">;
  onClose: () => void;
}) => {
  return ["guidance" as const, "aboutUs" as const].map((linkSlug) => {
    const menuData = teachersData[linkSlug];
    if (!menuData.children || menuData.children.length === 0) return null;
    return (
      <MaybeVisuallyHidden
        key={linkSlug}
        hiddenElementId="teachers-links"
        shouldDisplay={linkSlug === selectedMenu}
      >
        <OakFlex $flexDirection={"column"} $gap={"spacing-40"}>
          <OakBox $width={"fit-content"} $position={"relative"}>
            <OakHeading tag="h2">{menuData.title}</OakHeading>
            <OakSvg
              $position={"absolute"}
              $color={"bg-decorative1-main"}
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
            id={`topnav-teachers-${linkSlug}`}
          >
            {menuData.children.map((link) => {
              const buttonId = focusManager.createId(
                `teachers-${linkSlug}`,
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
      </MaybeVisuallyHidden>
    );
  });
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
  const { track } = useAnalytics();

  return (
    <OakFlex $pa={"spacing-40"}>
      <MaybeVisuallyHidden
        hiddenElementId="teachers-phase-section"
        shouldDisplay={
          activeArea === "TEACHERS" &&
          (selectedMenu === "primary" || selectedMenu === "secondary")
        }
      >
        <TeachersPhaseSection
          focusManager={
            focusManager as DropdownFocusManager<TeachersSubNavData>
          }
          selectedMenu={
            selectedMenu === "primary" || selectedMenu === "secondary"
              ? selectedMenu
              : undefined
          }
          teachersData={teachers}
          onClick={(subject, keystage) => {
            track.browseRefined({
              platform: "owa",
              product: "teacher lesson resources",
              engagementIntent: "refine",
              componentType: "topnav-browse-button",
              eventVersion: "2.0.0",
              analyticsUseCase: "Teacher",
              filterType: "Subject filter",
              filterValue: subject,
              activeFilters: { keystage: [keystage] },
              googleLoginHint: null,
              clientEnvironment: null,
            });
            props.onClose();
          }}
        />
      </MaybeVisuallyHidden>

      <MaybeVisuallyHidden
        hiddenElementId="teachers-links-section"
        shouldDisplay={
          activeArea === "TEACHERS" &&
          (selectedMenu === "guidance" || selectedMenu === "aboutUs")
        }
      >
        <TeachersLinksSection
          focusManager={
            focusManager as DropdownFocusManager<TeachersSubNavData>
          }
          selectedMenu={
            selectedMenu === "guidance" || selectedMenu === "aboutUs"
              ? selectedMenu
              : undefined
          }
          teachersData={teachers}
          onClose={props.onClose}
        />
      </MaybeVisuallyHidden>

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
