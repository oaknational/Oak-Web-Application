import { OakTagFunctional } from "@oaknational/oak-components";

import { useComplexCopyright } from "@/hooks/useComplexCopyright";

export function LessonComplexCopyrightTag({
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
  } = useComplexCopyright({
    loginRequired: loginRequired,
    geoRestricted: georestricted,
  });

  const showComplexCopyrightTag =
    showSignedOutLoginRequired || showSignedOutGeoRestricted || showGeoBlocked;

  return (
    showComplexCopyrightTag && (
      <OakTagFunctional
        iconName="copyright"
        isTrailingIcon
        $maxHeight={"spacing-32"}
        $borderRadius={"border-radius-s"}
        $borderColor={"border-neutral"}
        $borderStyle={"solid"}
        $bv={"border-solid-s"}
        $bh={"border-solid-s"}
        $background={"bg-neutral"}
        label="Copyrighted"
      />
    )
  );
}
