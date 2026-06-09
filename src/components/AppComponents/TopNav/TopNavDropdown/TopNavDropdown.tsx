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
  TeachersBrowse,
  isDropdownMenuItem,
  isTeachersBrowseItem,
  isNavDropDownButtonItem,
  NavDropDownButton,
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
  phase: string;
  selectedMenu?: TopNavDropdownProps["selectedMenu"];
  focusManager: DropdownFocusManager<TeachersSubNavData>;
  onClick: (subject: string, keystage: string) => void;
}) => {
  const { track } = useAnalytics();
  const defaultKeystage = selectedMenu
    ? phaseData.children?.[0]?.slug
    : undefined;

  const [selectedKeystage, setSelectedKeystage] = useState<string | undefined>(
    defaultKeystage,
  );

  const [selectedSubject, setSelectedSubject] = useState<TeachersBrowse | null>(
    null,
  );

  useEffect(() => {
    setSelectedKeystage(defaultKeystage);
    setSelectedSubject(null);
  }, [defaultKeystage]);

  const keystagesRef = useRef<HTMLDivElement>(null);

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
    setSelectedSubject(null);
  };

  const handleExamBoardPanelOpen = (subject: TeachersBrowse) => {
    setSelectedSubject(subject);
  };

  // const closeExamBoardPanel = () => {
  //   setSelectedSubject(null);
  // };

  const isKeystageOpen = (slug: string) => selectedKeystage === slug;
  return (
    <OakFlex $gap={"spacing-40"}>
      <OakFlex
        $display={"flex"}
        $flexDirection={"column"}
        $gap={"spacing-8"}
        $pa={"spacing-0"}
        id={`topnav-teachers-${phase}`}
        role="tablist"
        ref={keystagesRef}
      >
        {phaseData.children?.map((keystage) => {
          const buttonId = focusManager.createId(
            `teachers-${phase}`,
            keystage.slug,
          );
          return (
            <OakLeftAlignedButton
              key={keystage.slug}
              aria-expanded={isKeystageOpen(keystage.slug)}
              aria-controls={
                isKeystageOpen(keystage.slug)
                  ? `topnav-teachers-${keystage.slug}-subjects`
                  : undefined
              }
              role="tab"
              aria-selected={isKeystageOpen(keystage.slug)}
              iconName="chevron-right"
              isTrailingIcon
              rightAlignIcon
              width={"spacing-160"}
              selected={isKeystageOpen(keystage.slug)}
              onClick={() => onKeystageClick(keystage.slug)}
              onKeyDown={(e) => focusManager.handleKeyDown(e, buttonId)}
              aria-current={isKeystageOpen(keystage.slug) ? "true" : undefined}
              id={buttonId}
              aria-label={
                keystage.title === "EYFS"
                  ? "Early years foundation stage"
                  : undefined
              }
              aria-disabled={selectedMenu !== phase}
            >
              {keystage.title.replace("KS", "Key stage ")}
            </OakLeftAlignedButton>
          );
        })}
      </OakFlex>
      {phaseData.children?.map((keystage) => (
        <MaybeVisuallyHidden
          key={keystage.slug}
          hiddenElementId={`teachers-subjects-section-${keystage.slug}`}
          shouldDisplay={keystage.slug === selectedKeystage}
        >
          <TopNavSubjectButtons
            handleClick={onClick}
            focusManager={focusManager}
            phase={phase}
            selectedMenu={selectedMenu}
            subjects={keystage.children}
            keyStageSlug={keystage.slug}
            selectedSubject={selectedSubject}
            onExamBoardPanelOpen={handleExamBoardPanelOpen}
          />
        </MaybeVisuallyHidden>
      ))}
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
          const buttonId = focusManager.createId(
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
            const buttonId = focusManager?.createId(
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
