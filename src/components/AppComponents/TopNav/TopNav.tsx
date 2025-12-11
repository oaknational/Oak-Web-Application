import {
  OakFlex,
  OakImage,
  OakLink,
  OakPrimaryButton,
  OakSecondaryButton,
} from "@oaknational/oak-components";

import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { resolveOakHref } from "@/common-lib/urls";

const TopNav = () => {
  const isTeachersActive = true; // TODO: use hook

  const TeachersTabLink = isTeachersActive
    ? OakSecondaryButton
    : OakPrimaryButton;

  const PupilsTabLink = isTeachersActive
    ? OakPrimaryButton
    : OakSecondaryButton;

  return (
    <>
      <OakFlex
        $background={"bg-btn-primary"}
        $ph={"spacing-40"}
        $pb={"spacing-0"}
        $pt={"spacing-16"}
        $justifyContent={["center", "left"]}
      >
        <TeachersTabLink
          element="a"
          $bblr={"border-radius-square"}
          $bbrr={"border-radius-square"}
          $bb={"border-solid-none"}
          width={["100%", "max-content"]}
          href={resolveOakHref({ page: "teachers-home-page" })}
        >
          Teachers
        </TeachersTabLink>
        <PupilsTabLink
          element="a"
          $bblr={"border-radius-square"}
          $bbrr={"border-radius-square"}
          $bb={"border-solid-none"}
          width={["100%", "max-content"]}
          href={resolveOakHref({ page: "pupil-year-index" })}
        >
          Go to Pupils
        </PupilsTabLink>
      </OakFlex>
      <OakFlex $background={"bg-primary"} $pv={"spacing-20"} $ph={"spacing-40"}>
        <OakLink href={resolveOakHref({ page: "home" })}>
          <OakImage
            src={getCloudinaryImageUrl("v1765468420/OakLogoWithText.svg")}
            alt=""
            $height={"spacing-32"}
            $width={"spacing-80"}
          />
        </OakLink>
      </OakFlex>
    </>
  );
};

export default TopNav;
