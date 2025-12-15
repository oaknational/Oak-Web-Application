"use client";
import TabLink from "./TabLink/TabLink";
import TeachersSubNav from "./SubNav/TeachersSubNav";
import PupilsSubNav from "./SubNav/PupilsSubNav";

import { OakFlex, OakIcon, OakImage, OakLink } from "@/styles/oakThemeApp";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { resolveOakHref } from "@/common-lib/urls";
import useMediaQuery from "@/hooks/useMediaQuery";

const TopNav = () => {
  const isTeachersActive = false; // TODO: use hook
  const isMobile = useMediaQuery("mobile");

  return (
    <>
      <OakFlex
        $background={"bg-btn-primary"}
        $ph={"spacing-40"}
        $pb={"spacing-0"}
        $pt={"spacing-16"}
        $justifyContent={["center", "left"]}
        $gap={"spacing-16"}
      >
        <TabLink
          isSelected={isTeachersActive}
          href={resolveOakHref({ page: "teachers-home-page" })}
        >
          {!isTeachersActive && "Go to "}Teachers
        </TabLink>
        <TabLink
          isSelected={!isTeachersActive}
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
          {isTeachersActive && "Go to "}Pupils
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
      >
        <OakLink href={resolveOakHref({ page: "home" })}>
          <OakImage
            src={getCloudinaryImageUrl(
              isMobile
                ? "v1711468346/logo-mark.svg"
                : "v1765468420/OakLogoWithText.svg",
            )}
            alt=""
            $height={"spacing-40"}
            $width={["spacing-32", "spacing-80"]}
            $pa={"spacing-0"}
          />
        </OakLink>
        {isTeachersActive ? <TeachersSubNav /> : <PupilsSubNav />}
      </OakFlex>
    </>
  );
};

export default TopNav;
