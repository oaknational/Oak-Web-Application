import TabLink from "./TabLink/TabLink";
import TeachersSubNav from "./SubNav/TeachersSubNav";
import PupilsSubNav from "./SubNav/PupilsSubNav";

import { OakFlex, OakImage, OakLink } from "@/styles/oakThemeApp";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { resolveOakHref } from "@/common-lib/urls";

const TopNav = () => {
  const isTeachersActive = true; // TODO: use hook

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
          Teachers
        </TabLink>
        <TabLink
          isSelected={!isTeachersActive}
          href={resolveOakHref({ page: "pupil-year-index" })}
        >
          Go to Pupils
        </TabLink>
      </OakFlex>
      <OakFlex
        $background={"bg-primary"}
        $pv={"spacing-20"}
        $ph={"spacing-40"}
        $bb={"border-solid-s"}
        $borderColor={"border-neutral-lighter"}
        $alignItems={"center"}
        $gap={"spacing-24"}
      >
        <OakLink href={resolveOakHref({ page: "home" })}>
          <OakImage
            src={getCloudinaryImageUrl("v1765468420/OakLogoWithText.svg")}
            alt=""
            $height={"spacing-40"}
            $width={"spacing-80"}
            $pa={"spacing-0"}
            $display={["none", "block", "block"]}
          />
          {/* TODO: mobile logo */}
        </OakLink>
        {isTeachersActive ? <TeachersSubNav /> : <PupilsSubNav />}
      </OakFlex>
    </>
  );
};

export default TopNav;
