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
  const showCopyrightedTag = (() => {
    const userGeoAuthenticated = user?.publicMetadata?.owa?.isRegionAuthorised;

    if ((lessonLoginRequired || lessonGeorestricted) && !isSignedIn) {
      return true;
    }

    if (lessonGeorestricted && isSignedIn && !userGeoAuthenticated) {
      return true;
    }
    return false;
  })();

  return (
    showCopyrightedTag && (
      <OakTagFunctional
        iconName="copyright"
        isTrailingIcon
        $maxHeight={"all-spacing-7"}
        $borderRadius={"border-radius-s"}
        $borderStyle={"solid"}
        $background={"grey20"}
        label="Copyrighted"
      />
    )
  );
}
