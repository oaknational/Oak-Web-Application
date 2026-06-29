import { useState } from "react";
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
import {
  getKeystageButtonNodeId,
  getSecondLevelNavButton,
  getSubjectButtonId,
} from "../DropdownFocusManager/helpers";

import TopNavSubjectButtons from "./TopNavSubjectButtons";

import { resolveOakHref, ResolveOakHrefProps } from "@/common-lib/urls";
import {
  TeachersSubNavData,
  PupilsSubNavData,
  isDropdownMenuItem,
  NavDropDownButton,
  SubjectsMenu,
  PhaseSubjectsMenu,
  PhaseSlug,
  KeystageMenu,
  isTeachersBrowseItem,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { KeystageSlug } from "@/node-lib/curriculum-api-2023/shared.schema";

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
  onClick: (subject: SubjectsMenu, keystage: string) => void;
  onClose: () => void;
}) => {
  return Object.entries(teachersData).map(([menu, data]) => {
    if (isTeachersBrowseItem(data)) {
      return (
        <MaybeVisuallyHidden
          key={menu}
          hiddenElementId={`teachers-dropdown-section-${menu}`}
          shouldDisplay={selectedMenu === menu}
        >
          <TeachersPhaseSection
            phase={data.phases.slug}
            phaseData={data.phases}
            keystageData={data.keystages}
            focusManager={focusManager}
            onClick={onClick}
            selectedMenu={selectedMenu}
          />
        </MaybeVisuallyHidden>
      );
    } else if (isDropdownMenuItem(data)) {
      return (
        <MaybeVisuallyHidden
          key={menu}
          hiddenElementId={`teachers-dropdown-section-${menu}`}
          shouldDisplay={selectedMenu === menu}
        >
          <TeachersLinksSection
            focusManager={focusManager}
            linkData={data}
            onClose={onClose}
          />
        </MaybeVisuallyHidden>
      );
    }

    return null;
  });
};

const TeachersPhaseSection = ({
  phaseData,
  keystageData,
  phase,
  selectedMenu,
  focusManager,
  onClick,
}: {
  phaseData: PhaseSubjectsMenu;
  keystageData: KeystageMenu;
  phase: PhaseSlug;
  selectedMenu?: TopNavDropdownProps["selectedMenu"];
  focusManager: DropdownFocusManager<TeachersSubNavData>;
  onClick: (subject: SubjectsMenu, keystage: string) => void;
}) => {
  const { track } = useAnalytics();
  const keystageChildren = keystageData.children;
  const phaseSubjectChildren = phaseData.children;
  const hasKeystageChildren = keystageChildren.length > 0;

  const isActivePhase = selectedMenu === phaseData.slug;
  const defaultTopLevel =
    isActivePhase || !hasKeystageChildren ? phaseData.slug : keystageData.slug;
  const defaultKeystage = isActivePhase
    ? phaseData.slug
    : (keystageChildren[0]?.slug ?? phaseData.slug);

  const [selectedTopLevel, setSelectedTopLevel] = useState<string | undefined>(
    defaultTopLevel,
  );
  const [selectedViewType, setSelectedViewType] = useState<string | undefined>(
    defaultKeystage,
  );

  const [selectedSubject, setSelectedSubject] = useState<SubjectsMenu | null>(
    null,
  );

  const onTopLevelClick = (slug: string) => {
    setSelectedTopLevel(slug);
    if (slug === phaseData.slug) {
      setSelectedViewType(phaseData.slug);
    } else if (slug === keystageData.slug) {
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

  const hasExamBoards = (subject: SubjectsMenu | null) => {
    return Boolean(subject?.children && subject.children.length > 0);
  };

  const handleExamBoardPanelOpen = (subject: SubjectsMenu) => {
    if (!hasExamBoards(subject)) {
      return;
    }
    setSelectedSubject(subject);
  };

  const closeExamBoardPanel = () => {
    setSelectedSubject(null);
  };

  const renderNavButtons = (
    slug: string,
    title: string,
    isOpen: (s: string) => boolean,
    onClickFn: (s: string) => void,
  ) => {
    const shouldShowControls =
      slug !== keystageData.slug &&
      (phaseSubjectChildren.some((item) => item.slug === slug) ||
        keystageChildren.some((item) => item.slug === slug));

    const buttonId =
      slug === phaseData.slug || slug === keystageData.slug
        ? getSecondLevelNavButton({ focusManager, topLevelSlug: phase, slug })
        : getKeystageButtonNodeId({ focusManager, phase, slug });

    if (!buttonId) {
      return null;
    }

    return (
      <OakLeftAlignedButton
        key={slug}
        aria-expanded={isOpen(slug)}
        aria-controls={
          isOpen(slug) && shouldShowControls
            ? `topnav-teachers-${slug}-subjects`
            : undefined
        }
        iconName="chevron-right"
        isTrailingIcon
        rightAlignIcon
        width={"spacing-160"}
        selected={isOpen(slug)}
        onClick={() => onClickFn(slug)}
        onKeyDown={(e) => {
          focusManager.handleTabKeyDown(e, buttonId);
          focusManager.handleArrowKeyDown(e, buttonId);
        }}
        id={buttonId}
        aria-label={
          title === "EYFS" ? "Early years foundation stage" : undefined
        }
      >
        {title}
      </OakLeftAlignedButton>
    );
  };

  const renderSubjectButtons = (
    slug: KeystageSlug | PhaseSlug,
    children: SubjectsMenu[],
  ) => {
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
          selectedSubject={selectedSubject}
          onExamBoardPanelOpen={handleExamBoardPanelOpen}
          onExamboardPanelClose={closeExamBoardPanel}
          identifyingSlug={slug}
          getButtonId={(key) =>
            getSubjectButtonId({
              focusManager,
              slug: key,
              phase,
              identifyingSlug: slug,
            })
          }
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
      >
        {renderNavButtons(
          phaseData.slug,
          phaseData.title,
          isTopLevelOpen,
          onTopLevelClick,
        )}
        {hasKeystageChildren &&
          renderNavButtons(
            keystageData.slug,
            "Key stages",
            isTopLevelOpen,
            onTopLevelClick,
          )}
      </OakFlex>
      {selectedTopLevel === keystageData.slug && (
        <>
          <OakFlex
            $display={"flex"}
            $flexDirection={"column"}
            $gap={"spacing-8"}
          >
            {keystageChildren.map((keystage) =>
              renderNavButtons(
                keystage.slug,
                keystage.title.replace("KS", "Key stage "),
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
      {selectedTopLevel === phaseData.slug &&
        renderSubjectButtons(phaseData.slug, phaseSubjectChildren)}
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
          const buttonId = getSecondLevelNavButton({
            focusManager,
            slug: link.slug,
            topLevelSlug: linkData.slug,
          });
          if (!buttonId) return null;
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
                onKeyDown={(e) => focusManager.handleTabKeyDown(e, buttonId)}
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
            const buttonId = getSecondLevelNavButton({
              focusManager,
              slug: year.slug,
              topLevelSlug: menu,
            });

            if (!buttonId) return null;
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
                      ? (e) => focusManager.handleTabKeyDown(e, buttonId)
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
              filterValue: subject.subjectSlug,
              activeFilters: { keystages: [keystage] },
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
