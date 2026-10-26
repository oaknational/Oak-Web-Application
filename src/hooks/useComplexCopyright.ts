import { useUser } from "@clerk/nextjs";

import { useProgrammeState } from "@/context/TeacherBrowseAnalytics/hooks/useProgrammeState";
import { getCopyrightRestrictionForSubject } from "@/utils/getCopyrightRestrictionForSubject";

interface UseComplexCopyrightProps {
  loginRequired: boolean;
  geoRestricted: boolean;
}

export interface UseComplexCopyrightReturn {
  showSignedOutLoginRequired: boolean;
  showSignedOutGeoRestricted: boolean;
  showSignedInNotOnboarded: boolean;
  showGeoBlocked: boolean;
  isLoaded: boolean;
  isResourceGeorestricted: boolean;
}

export function useComplexCopyright({
  loginRequired,
  geoRestricted,
}: UseComplexCopyrightProps): UseComplexCopyrightReturn {
  const { user, isSignedIn, isLoaded } = useUser();
  const { coreProgrammeState } = useProgrammeState();

  const isUserOnboarded =
    (isSignedIn && user?.publicMetadata?.owa?.isOnboarded) ?? false;

  const { resourceIsGeorestricted, resourceRequiresLogin } =
    getCopyrightRestrictionForSubject({
      subjectSlug: coreProgrammeState?.subjectSlug,
      geoRestricted,
      loginRequired,
    });

  const showSignedInNotOnboarded = Boolean(
    !isUserOnboarded &&
      (resourceIsGeorestricted || resourceRequiresLogin) &&
      isSignedIn,
  );
  const isUserRegionAuthorised =
    user?.publicMetadata?.owa?.isRegionAuthorised !== false;

  return {
    showSignedOutLoginRequired: !isSignedIn && resourceRequiresLogin,
    showSignedOutGeoRestricted: !isSignedIn && resourceIsGeorestricted,
    showGeoBlocked: Boolean(
      isSignedIn && resourceIsGeorestricted && !isUserRegionAuthorised,
    ),
    showSignedInNotOnboarded,
    isLoaded,
    isResourceGeorestricted: resourceIsGeorestricted,
  };
}
