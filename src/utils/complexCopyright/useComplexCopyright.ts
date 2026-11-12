import { useUser } from "@clerk/nextjs";

import { AuthState, ComplexCopyrightStatus } from "./complexCopyright.types";
import { getComplexCopyrightState } from "./getComplexCopyrightState";

import { useProgrammeState } from "@/context/TeacherBrowseAnalytics/hooks/useProgrammeState";
import { getCopyrightRestrictionForSubject } from "@/utils/getCopyrightRestrictionForSubject";

interface UseComplexCopyrightProps {
  loginRequired: boolean;
  geoRestricted: boolean;
}

export function useComplexCopyright({
  loginRequired,
  geoRestricted,
}: UseComplexCopyrightProps): ComplexCopyrightStatus {
  const { user, isSignedIn } = useUser();
  const { coreProgrammeState } = useProgrammeState();

  const isUserOnboarded =
    (isSignedIn && user?.publicMetadata?.owa?.isOnboarded) ?? false;

  const { resourceIsGeorestricted, resourceRequiresLogin } =
    getCopyrightRestrictionForSubject({
      subjectSlug: coreProgrammeState?.subjectSlug,
      geoRestricted,
      loginRequired,
    });

  const isUserRegionAuthorised =
    user?.publicMetadata?.owa?.isRegionAuthorised !== false;

  const authState: AuthState = {
    isSignedIn: !!isSignedIn,
    isOnboarded: isUserOnboarded,
    isRegionAuthorised: isUserRegionAuthorised,
  };

  return getComplexCopyrightState({
    authState,
    resourceIsGeorestricted,
    resourceRequiresLogin,
  });
}
