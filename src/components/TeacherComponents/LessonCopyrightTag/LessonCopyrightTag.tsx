import { OakTagFunctional } from "@oaknational/oak-components";
import { useUser } from "@clerk/nextjs";

export function LessonCopyrightTag({
  lessonLoginRequired,
  lessonGeorestricted,
}: {
  lessonLoginRequired?: boolean;
  lessonGeorestricted?: boolean;
}) {
  const { user, isSignedIn } = useUser();
  const userGeoAuthenticated = user?.publicMetadata?.owa?.isRegionAuthorised;

  const showSignedOutTag =
    (lessonLoginRequired || lessonGeorestricted) && !isSignedIn;

  const showGeorestrictedTag =
    lessonGeorestricted && isSignedIn && !userGeoAuthenticated;

  const showCopyrightedTag = showSignedOutTag || showGeorestrictedTag;

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
