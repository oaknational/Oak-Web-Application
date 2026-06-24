"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

import SubNav from "./SubNav/SubNav";
import TopNavDropdown from "./TopNavDropdown/TopNavDropdown";
import { TeachersTopNavHamburger } from "./TeachersTopNavHamburger/TeachersTopNavHamburger";
import { PupilsTopNavHamburger } from "./PupilsTopNavHamburger/PupilsTopNavHamburger";
import { DropdownFocusManager } from "./DropdownFocusManager/DropdownFocusManager";
import { buildFocusTree } from "./DropdownFocusManager/focusTree";
import TopNavMinimal from "./TopNavMinimal";

import { OakFlex } from "@/styles/oakThemeApp";
import useSelectedArea from "@/hooks/useSelectedArea";
import {
  TeachersSubNavData,
  PupilsSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";
import useAnalytics from "@/context/Analytics/useAnalytics";

export type TopNavProps = {
  teachers: TeachersSubNavData | null;
  pupils: PupilsSubNavData | null;
};

const visuallyHiddenStyle = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "absolute" as const,
  width: "1px",
  whiteSpace: "nowrap" as const,
};

/**
 * Wrapper component which visually hides children unless a shouldDisplay condition is met until the client intialises
 * This allows elements to be added to the dom on the server while still being hidden until needed
 */
export const MaybeVisuallyHidden = ({
  shouldDisplay,
  hiddenElementId,
  children,
}: {
  shouldDisplay: boolean;
  children?: React.ReactNode;
  hiddenElementId: string;
}) => {
  // Fully remove the visually hidden elements from the page when the client initialises to prevent issues with focus and screen readers
  const [afterInitialRender, setAfterInitialRender] = useState(false);

  useEffect(() => {
    setAfterInitialRender(true);
  }, []);

  if (shouldDisplay) {
    return children;
  } else {
    return afterInitialRender ? null : (
      <span
        id={`visually-hidden-${hiddenElementId}`}
        style={visuallyHiddenStyle}
      >
        {children}
      </span>
    );
  }
};

const TopNav = (props: TopNavProps) => {
  const { teachers, pupils } = props;
  const { track } = useAnalytics();

  const activeArea = useSelectedArea();

  // TD: [integrated journey] potentially extract into a menu store
  const [selectedMenu, setSelectedMenu] = useState<
    keyof TeachersSubNavData | keyof PupilsSubNavData | undefined
  >(undefined);

  const trackBrowseAccessed = (menu: string) => {
    const menuIsOpening = selectedMenu === undefined || selectedMenu !== menu;
    const menuIsBrowseJourney = menu === "primary" || menu == "secondary";

    if (menuIsOpening && menuIsBrowseJourney) {
      track.browseAccessed({
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "explore",
        componentType: "topnav-browse-button",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
      });
    }
  };

  const focusManager = useMemo(() => {
    if (activeArea === "TEACHERS" && teachers) {
      return new DropdownFocusManager<TeachersSubNavData>(
        buildFocusTree(teachers, "teachers"),
        "teachers",
        setSelectedMenu,
      );
    } else if (activeArea === "PUPILS" && pupils) {
      return new DropdownFocusManager<PupilsSubNavData>(
        buildFocusTree(pupils, "pupils"),
        "pupils",
        setSelectedMenu,
      );
    }
    return undefined;
  }, [activeArea, teachers, pupils]);

  const isMenuSelected = useCallback(
    (menuSlug: string) => {
      return menuSlug === selectedMenu;
    },
    [selectedMenu],
  );

  const handleCloseDropdown = useCallback(() => {
    setSelectedMenu(undefined);
  }, []);

  const { setCurrentBannerProps } = useOakNotificationsContext();

  useEffect(() => {
    if (
      (activeArea === "PUPILS" && !pupils) ||
      (activeArea === "TEACHERS" && !teachers)
    ) {
      setCurrentBannerProps({
        message:
          "We’re experiencing a temporary technical issue. Thank you for your patience while we look into it.",
        type: "warning",
        isOpen: true,
      });
    } else {
      setCurrentBannerProps(null);
    }
  }, [teachers, pupils, activeArea, setCurrentBannerProps]);

  return (
    <TopNavMinimal
      focusManager={focusManager}
      subnavSlot={
        <>
          {activeArea === "TEACHERS" && teachers && focusManager && (
            <>
              <SubNav
                {...teachers}
                area="teachers"
                focusManager={
                  focusManager as DropdownFocusManager<TeachersSubNavData>
                }
                isMenuSelected={isMenuSelected}
                onClick={(menu) => {
                  trackBrowseAccessed(menu);
                  setSelectedMenu(selectedMenu === menu ? undefined : menu);
                }}
              />
              <TeachersTopNavHamburger {...teachers} />
            </>
          )}
          {activeArea === "PUPILS" && pupils && focusManager && (
            <>
              <SubNav
                {...pupils}
                area="pupils"
                focusManager={
                  focusManager as DropdownFocusManager<PupilsSubNavData>
                }
                isMenuSelected={isMenuSelected}
                onClick={(menu) => {
                  setSelectedMenu(selectedMenu === menu ? undefined : menu);
                }}
              />
              <PupilsTopNavHamburger {...pupils} />
            </>
          )}
        </>
      }
      menuSlot={
        teachers &&
        pupils && (
          <MaybeVisuallyHidden
            hiddenElementId="top-nav-dropdown"
            shouldDisplay={!!selectedMenu}
          >
            <OakFlex
              $display={["none", "none", "flex"]}
              $width={"100%"}
              $flexDirection={"column"}
              $background={"bg-primary"}
              data-testid="topnav-dropdown-container"
              $bb="border-solid-s"
              $borderColor="border-neutral-lighter"
            >
              <TopNavDropdown
                focusManager={focusManager}
                activeArea={activeArea}
                selectedMenu={selectedMenu}
                teachers={teachers}
                pupils={pupils}
                onClose={handleCloseDropdown}
              />
            </OakFlex>
          </MaybeVisuallyHidden>
        )
      }
     />
  );
};

export default TopNav;
