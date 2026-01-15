"use client";
import { useCallback, useState } from "react";

import TabLink from "./TabLink/TabLink";
import TeachersSubNav from "./SubNav/TeachersSubNav";
import PupilsSubNav from "./SubNav/PupilsSubNav";
import TopNavDropdown from "./TopNavDropdown/TopNavDropdown";

import { OakFlex, OakIcon, OakImage, OakLink } from "@/styles/oakThemeApp";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { resolveOakHref } from "@/common-lib/urls";
import useMediaQuery from "@/hooks/useMediaQuery";
import useSelectedArea from "@/hooks/useSelectedArea";
import {
  TeachersSubNavData,
  PupilsSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

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

  const isMenuSelected = useCallback(
    (menuSlug: string) => {
      return menuSlug === selectedMenu;
    },
    [selectedMenu],
  );

  return (
    <header>
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
          <TeachersSubNav
            isMenuSelected={isMenuSelected}
            onClick={(menu) => {
              setSelectedMenu(selectedMenu === menu ? undefined : menu);
              console.log("selected menu ", teachers[menu]);
            }}
          />
        )}
        {activeArea === "PUPILS" && pupils && (
          <PupilsSubNav
            isMenuSelected={isMenuSelected}
            onClick={(menu) => {
              setSelectedMenu(selectedMenu === menu ? undefined : menu);
              console.log("selected menu ", pupils[menu]);
            }}
          />
        )}
      </OakFlex>
      {/* TD: [integrated-journey] Replace with dropdown and hamburger menus */}
      {selectedMenu &&
        ((activeArea === "TEACHERS" && teachers) ||
          (activeArea === "PUPILS" && pupils)) && (
          <OakFlex
            $width={"100%"}
            // $height="spacing-240"
            $flexDirection={"column"}
          >
            <TopNavDropdown
              selectedMenu={selectedMenu}
              teachers={teachers!}
              pupils={pupils!}
            />
          </OakFlex>
        )}
    </header>
  );
};

export default TopNav;
