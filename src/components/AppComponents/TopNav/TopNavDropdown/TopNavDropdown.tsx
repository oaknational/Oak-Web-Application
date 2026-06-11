import { useRef, useState } from "react";
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
import { createFocusId } from "../DropdownFocusManager/focusTree";

import TopNavSubjectButtons from "./TopNavSubjectButtons";

import { resolveOakHref, ResolveOakHrefProps } from "@/common-lib/urls";
import {
  TeachersSubNavData,
  PupilsSubNavData,
  TeachersBrowse,
  isDropdownMenuItem,
  isTeachersBrowseItem,
  isNavDropDownButtonItem,
  NavDropDownButton,
  SubjectsNavItem,
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

const TeachersDropdownMenuSections = ({
  teachersData,
  selectedMenu,
  focusManager,
  onClick,
  onClose,
}: {
  teachersData: TeachersSubNavData;
  selectedMenu?: TopNavDropdownProps["selectedMenu"];
  focusManager: DropdownFocusManager<TeachersSubNavData>;
  onClick: (subject: string, keystage: string) => void;
  onClose: () => void;
}) => {
  return Object.entries(teachersData).map(([menu, data]) => {
    if (!isDropdownMenuItem(data)) return null;

    return (
      <MaybeVisuallyHidden
        key={menu}
        hiddenElementId={`teachers-dropdown-section-${menu}`}
        shouldDisplay={selectedMenu === menu}
      >
        {isTeachersBrowseItem(data) && (
          <TeachersPhaseSection
            phase={data.slug}
            phaseData={data}
            focusManager={focusManager}
            onClick={onClick}
            selectedMenu={selectedMenu}
          />
        )}
        {isNavDropDownButtonItem(data) && (
          <TeachersLinksSection
            focusManager={focusManager}
            linkData={data}
            onClose={onClose}
          />
        )}
      </MaybeVisuallyHidden>
    );
  });
};

const TeachersPhaseSection = ({
  phaseData,
  phase,
  selectedMenu,
  focusManager,
  onClick,
}: {
  phaseData: TeachersBrowse;
  phase: "primary" | "secondary";
  selectedMenu?: TopNavDropdownProps["selectedMenu"];
  focusManager: DropdownFocusManager<TeachersSubNavData>;
  onClick: (subject: string, keystage: string) => void;
}) => {
  const { track } = useAnalytics();
  const keystageChildren = phaseData.children.filter(
    (item) => item.type === "keystage",
  );
  const phaseSubjectChildren = phaseData.children.filter(
    (item) => item.type === "phase",
  );
  const hasKeystageChildren = keystageChildren.length > 0;

  const isActivePhase = selectedMenu === phaseData.slug;
  const defaultTopLevel =
    isActivePhase || !hasKeystageChildren ? phaseData.slug : "keystages";
  const defaultKeystage = isActivePhase
    ? phaseData.slug
    : (keystageChildren[0]?.slug ?? phaseData.slug);

  const [selectedTopLevel, setSelectedTopLevel] = useState<string | undefined>(
    defaultTopLevel,
  );
  const [selectedViewType, setSelectedViewType] = useState<string | undefined>(
    defaultKeystage,
  );

  const [selectedSubject, setSelectedSubject] =
    useState<SubjectsNavItem | null>(null);

  const keystagesRef = useRef<HTMLDivElement>(null);

  const onTopLevelClick = (slug: string) => {
    setSelectedTopLevel(slug);
    if (slug === phaseData.slug) {
      setSelectedViewType(phaseData.slug);
    } else if (slug === "keystages") {
      setSelectedViewType(keystageChildren[0]?.slug);
    }
    setSelectedSubject(null);
  };

  const onKeystageClick = (viewType: string) => {
    track.browseRefined({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "refine",
      componentType: "topnav-browse-button",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      filterType: viewType.includes("ks") ? "Key stage filter" : "Phase filter",
      filterValue: viewType,
      activeFilters: {},
      googleLoginHint: null,
      clientEnvironment: null,
    });
    setSelectedViewType(viewType);
    setSelectedSubject(null);
  };

  const hasExamBoards = (subject: SubjectsNavItem | null) => {
    return Boolean(subject?.examBoards && subject.examBoards.length > 0);
  };

  const handleExamBoardPanelOpen = (subject: SubjectsNavItem) => {
    if (!hasExamBoards(subject)) {
      return;
    }
    setSelectedSubject(subject);
  };

  const closeExamBoardPanel = () => {
    setSelectedSubject(null);
  };

  // Arrow key navigation for up/down in keystages
  const handleKeystageArrowKeys = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (!selectedMenu) return;
    const focusableElements = keystageChildren.map((keystage) =>
      createFocusId("teachers", `teachers-${phaseData.slug}`, keystage.slug),
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

  const renderNavButtons = (
    slug: string,
    title: string,
    isOpen: (s: string) => boolean,
    onClickFn: (s: string) => void,
  ) => {
    const buttonId = createFocusId("teachers", `teachers-${phase}`, slug);

    return (
      <OakLeftAlignedButton
        key={slug}
        aria-expanded={isOpen(slug)}
        aria-controls={
          isOpen(slug) && slug !== "keystages"
            ? `topnav-teachers-${slug}-subjects`
            : undefined
        }
        iconName="chevron-right"
        isTrailingIcon
        rightAlignIcon
        width={"spacing-160"}
        selected={isOpen(slug)}
        onClick={() => onClickFn(slug)}
        onKeyDown={(e) => focusManager.handleKeyDown(e, buttonId)}
        id={buttonId}
        aria-label={
          title === "EYFS" ? "Early years foundation stage" : undefined
        }
      >
        {title.replace("KS", "Key stage ")}
      </OakLeftAlignedButton>
    );
  };

  const renderSubjectButtons = (slug: string, children: SubjectsNavItem[]) => {
    return (
      <MaybeVisuallyHidden
        key={slug}
        hiddenElementId={`teachers-subjects-section-${slug}`}
        shouldDisplay={slug === selectedViewType}
      >
        <TopNavSubjectButtons
          handleClick={onClick}
          focusManager={focusManager}
          phase={phase}
          selectedMenu={selectedMenu}
          subjects={children}
          viewTypeSlug={slug}
          selectedSubject={selectedSubject}
          onExamBoardPanelOpen={handleExamBoardPanelOpen}
          closeExamBoardPanel={closeExamBoardPanel}
        />
      </MaybeVisuallyHidden>
    );
  };

  const isTopLevelOpen = (slug: string) => selectedTopLevel === slug;
  const isKeystageOpen = (slug: string) => selectedViewType === slug;
  return (
    <OakFlex $gap={"spacing-40"}>
      <OakFlex
        $display={"flex"}
        $flexDirection={"column"}
        $gap={"spacing-8"}
        $pa={"spacing-0"}
        id={`topnav-teachers-${phase}`}
        onKeyDown={handleKeystageArrowKeys}
      >
        {renderNavButtons(
          phaseData.slug,
          phaseData.title,
          isTopLevelOpen,
          onTopLevelClick,
        )}
        {hasKeystageChildren &&
          renderNavButtons(
            "keystages",
            "Key stages",
            isTopLevelOpen,
            onTopLevelClick,
          )}
      </OakFlex>
      {selectedTopLevel === "keystages" && (
        <>
          <OakFlex
            $display={"flex"}
            $flexDirection={"column"}
            $gap={"spacing-8"}
            role="tablist"
            ref={keystagesRef}
            onKeyDown={handleKeystageArrowKeys}
          >
            {keystageChildren.map((keystage) =>
              renderNavButtons(
                keystage.slug,
                keystage.title,
                isKeystageOpen,
                onKeystageClick,
              ),
            )}
          </OakFlex>
          {keystageChildren.map((keystage) =>
            renderSubjectButtons(keystage.slug, keystage.children),
          )}
        </>
      )}
      {selectedTopLevel === phaseData.slug && (
        <>
          {phaseSubjectChildren.map((group) =>
            renderSubjectButtons(group.slug, group.children),
          )}
        </>
      )}
    </OakFlex>
  );
};

const TeachersLinksSection = ({
  focusManager,
  linkData,
  onClose,
}: {
  focusManager: DropdownFocusManager<TeachersSubNavData>;
  linkData: NavDropDownButton;
  onClose: () => void;
}) => {
  return (
    <OakFlex $flexDirection={"column"} $gap={"spacing-40"}>
      <OakBox $width={"fit-content"} $position={"relative"}>
        <OakHeading tag="h2">{linkData.title}</OakHeading>
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
        id={`topnav-teachers-${linkData.slug}`}
      >
        {linkData.children.map((link) => {
          const buttonId = createFocusId(
            "teachers",
            `teachers-${linkData.slug}`,
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
  selectedMenu?: TopNavDropdownProps["selectedMenu"];
  pupils: PupilsSubNavData;
  focusManager: DropdownFocusManager<PupilsSubNavData>;
  onClose: () => void;
}) => {
  return Object.entries(pupils).map(([menu, data]) => {
    if (!isDropdownMenuItem(data)) return null;
    return (
      <MaybeVisuallyHidden
        key={menu}
        shouldDisplay={selectedMenu === menu}
        hiddenElementId={`pupils-dropdown-section-${menu}`}
      >
        <OakUL
          $display={"flex"}
          $gap={"spacing-16"}
          $reset
          id={`topnav-pupils-${menu}`}
        >
          {data.children.map((year) => {
            const buttonId = createFocusId(
              "pupils",
              `pupils-${menu}`,
              year.slug,
            );
            return (
              <OakLI key={year.slug}>
                <OakPupilJourneyYearButton
                  phase={data.slug}
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
      </MaybeVisuallyHidden>
    );
  });
};

const TopNavDropdown = (props: TopNavDropdownProps) => {
  const { activeArea, selectedMenu, teachers, pupils, focusManager, onClose } =
    props;
  const { track } = useAnalytics();

  return (
    <OakFlex $pa={"spacing-40"}>
      <MaybeVisuallyHidden
        hiddenElementId="teachers"
        shouldDisplay={activeArea === "TEACHERS"}
      >
        <TeachersDropdownMenuSections
          selectedMenu={selectedMenu}
          teachersData={teachers}
          focusManager={
            focusManager as DropdownFocusManager<TeachersSubNavData>
          }
          onClose={onClose}
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
            onClose();
          }}
        />
      </MaybeVisuallyHidden>
      <MaybeVisuallyHidden
        hiddenElementId="pupils"
        shouldDisplay={activeArea === "PUPILS"}
      >
        <PupilsSection
          selectedMenu={selectedMenu}
          pupils={pupils}
          focusManager={focusManager as DropdownFocusManager<PupilsSubNavData>}
          onClose={props.onClose}
        />
      </MaybeVisuallyHidden>
    </OakFlex>
  );
};

export default TopNavDropdown;
