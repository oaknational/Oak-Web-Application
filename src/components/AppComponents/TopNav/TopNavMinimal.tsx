"use client";

import { DropdownFocusManager } from "./DropdownFocusManager/DropdownFocusManager";
import TabLink from "./TabLink/TabLink";

import {
  OakBox,
  OakFlex,
  OakIcon,
  OakImage,
  OakLink,
} from "@/styles/oakThemeApp";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { resolveOakHref } from "@/common-lib/urls";
import SkipLink from "@/components/CurriculumComponents/OakComponentsKitchen/SkipLink";
import useSelectedArea from "@/hooks/useSelectedArea";
import {
  TeachersSubNavData,
  PupilsSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

/**
 * A minimal version of the top nav that doesn't rely on any context providers
 * Used in error pages on its own or can accept props to populate the full top nav
 */

const TopNavMinimal = ({
  focusManager,
  subnavSlot,
  menuSlot,
}: {
  focusManager?:
    | DropdownFocusManager<TeachersSubNavData>
    | DropdownFocusManager<PupilsSubNavData>;
  subnavSlot?: React.ReactNode;
  menuSlot?: React.ReactNode;
}) => {
  const activeArea = useSelectedArea();

  return (
    <OakBox
      as="header"
      $position="relative"
      data-testid="app-topnav"
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) =>
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
            src={getCloudinaryImageUrl("v1711468346/logo-mark.svg")}
            alt=""
            $height={"spacing-40"}
            $width={"spacing-32"}
            $pa={"spacing-0"}
            $display={["block", "none"]} // render this logo on mobile only
          />
          <OakImage
            src={getCloudinaryImageUrl("v1765468420/OakLogoWithText.svg")}
            alt=""
            $height={"spacing-48"}
            $width={"spacing-100"}
            $pa={"spacing-0"}
            $display={["none", "block"]} // render this logo on desktop only
          />
        </OakLink>
        {subnavSlot}
      </OakFlex>
      {menuSlot}
    </OakBox>
  );
};

export default TopNavMinimal;
