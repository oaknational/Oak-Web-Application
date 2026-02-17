"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

import TabLink from "./TabLink/TabLink";
import SubNav from "./SubNav/SubNav";
import TopNavDropdown from "./TopNavDropdown/TopNavDropdown";
import { TeachersTopNavHamburger } from "./TeachersTopNavHamburger/TeachersTopNavHamburger";
import { PupilsTopNavHamburger } from "./PupilsTopNavHamburger/PupilsTopNavHamburger";
import { DropdownFocusManager } from "./DropdownFocusManager/DropdownFocusManager";

import {
  OakBox,
  OakFlex,
  OakIcon,
  OakImage,
  OakLink,
} from "@/styles/oakThemeApp";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { resolveOakHref } from "@/common-lib/urls";
import useMediaQuery from "@/hooks/useMediaQuery";
import useSelectedArea from "@/hooks/useSelectedArea";
import SkipLink from "@/components/CurriculumComponents/OakComponentsKitchen/SkipLink";
import {
  TeachersSubNavData,
  PupilsSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";

export type TopNavProps = {
  teachers: TeachersSubNavData | null;
  pupils: PupilsSubNavData | null;
};

const TopNav = (props: TopNavProps) => {
  const { teachers, pupils } = props;

  const activeArea = useSelectedArea();
  const isMobile = useMediaQuery("mobile");

  // TD: [integrated journey] potentially extract into a menu store
  const [selectedMenu, setSelectedMenu] = useState<
    keyof TeachersSubNavData | keyof PupilsSubNavData | undefined
  >(undefined);

  const focusManager = useMemo(() => {
    if (activeArea === "TEACHERS" && teachers) {
      return new DropdownFocusManager<TeachersSubNavData>(
        teachers,
        "teachers",
        setSelectedMenu,
      );
    } else if (activeArea === "PUPILS" && pupils) {
      return new DropdownFocusManager<PupilsSubNavData>(
        pupils,
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
    <OakBox
      as="header"
      $position="relative"
      data-testid="app-topnav"
      onKeyDown={(event) =>
        focusManager?.handleEscapeKey({
          event,
          elementId: document.activeElement?.id || "",
        })
      }
    >
      <OakBox
        $position={"absolute"}
        $zIndex={"in-front"}
        $top={"spacing-160"} // TD: [integrated journey] adjust position when dropdown is open
        $left={"spacing-24"}
      >
        <SkipLink href={"#main"}>Skip to content</SkipLink>
      </OakBox>
      <OakFlex
        $background={"bg-btn-primary"}
        $ph={["spacing-20", "spacing-40"]}
        $pb={"spacing-0"}
        $pt={"spacing-16"}
        $justifyContent={["center", "left"]}
        $gap={"spacing-16"}
      >
        <TabLink
          isSelected={activeArea === "TEACHERS"}
          href={resolveOakHref({ page: "teachers-home-page" })}
          aria-current={activeArea === "TEACHERS"}
        >
          Teachers
        </TabLink>
        <TabLink
          isSelected={activeArea === "PUPILS"}
          href={resolveOakHref({ page: "pupil-year-index" })}
          iconOverride={
            <OakIcon
              iconName="pencil"
              $width={"spacing-24"}
              $height={"spacing-24"}
            />
          }
          isTrailingIcon
          aria-current={activeArea === "PUPILS"}
        >
          Pupils
        </TabLink>
      </OakFlex>
      <OakFlex
        $background={"bg-primary"}
        $pv={["spacing-16", "spacing-20"]}
        $ph={["spacing-20", "spacing-40"]}
        $bb={"border-solid-s"}
        $borderColor={"border-neutral-lighter"}
        $alignItems={"center"}
        $gap={"spacing-24"}
        $maxHeight={"spacing-80"}
        as={"nav"}
      >
        <OakLink
          href={resolveOakHref({
            page: activeArea === "PUPILS" ? "pupil-year-index" : "home",
          })}
          aria-label="Home"
        >
          <OakImage
            src={getCloudinaryImageUrl(
              isMobile
                ? "v1711468346/logo-mark.svg"
                : "v1765468420/OakLogoWithText.svg",
            )}
            alt=""
            $height={["spacing-40", "spacing-48"]}
            $width={["spacing-32", "spacing-100"]}
            $pa={"spacing-0"}
          />
        </OakLink>
        {activeArea === "TEACHERS" && teachers && (
          <>
            <SubNav
              {...teachers}
              area="teachers"
              focusManager={
                focusManager as DropdownFocusManager<TeachersSubNavData>
              }
              isMenuSelected={isMenuSelected}
              onClick={(menu) => {
                setSelectedMenu(selectedMenu === menu ? undefined : menu);
              }}
            />
            <TeachersTopNavHamburger {...teachers} />
          </>
        )}
        {activeArea === "PUPILS" && pupils && (
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
      </OakFlex>
      {selectedMenu &&
        ((activeArea === "TEACHERS" && teachers) ||
          (activeArea === "PUPILS" && pupils)) && (
          <OakFlex
            $display={["none", "none", "flex"]}
            $width={"100%"}
            $flexDirection={"column"}
            $background={"bg-primary"}
            data-testid="topnav-dropdown-container"
          >
            <TopNavDropdown
              focusManager={focusManager!}
              activeArea={activeArea}
              selectedMenu={selectedMenu}
              teachers={teachers!}
              pupils={pupils!}
              onClose={handleCloseDropdown}
            />
          </OakFlex>
        )}
    </OakBox>
  );
};

export default TopNav;
