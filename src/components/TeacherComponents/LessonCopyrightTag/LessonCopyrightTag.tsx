import { OakTagFunctional } from "@oaknational/oak-components";

import { useCopyrightRequirements } from "@/hooks/useCopyrightRequirements";

export function LessonCopyrightTag({
  loginRequired,
  georestricted,
}: {
  loginRequired: boolean;
  georestricted: boolean;
}) {
  const {
    showSignedOutLoginRequired,
    showSignedOutGeoRestricted,
    showGeoBlocked,
  } = useCopyrightRequirements({
    loginRequired: loginRequired,
    geoRestricted: georestricted,
  });

  const showCopyrightedTag =
    showSignedOutLoginRequired || showSignedOutGeoRestricted || showGeoBlocked;

  return (
    showCopyrightedTag && (
      <OakTagFunctional
        iconName="copyright"
        isTrailingIcon
        $maxHeight={"all-spacing-7"}
        $borderRadius={"border-radius-s"}
        $borderColor={"grey50"}
        $borderStyle={"solid"}
        $bv={"border-solid-s"}
        $bh={"border-solid-s"}
        $background={"grey20"}
        label="Copyrighted"
      />
    )
  );
}
