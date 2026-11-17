import { useUser } from "@clerk/nextjs";

import { AuthState, ComplexCopyrightStatus } from "./complexCopyright.types";
import { getComplexCopyrightState } from "./getComplexCopyrightState";
import { clerkMetadataSchema, getAuthState } from "./getAuthState";

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
  const { user, isSignedIn, isLoaded } = useUser();
  const { coreProgrammeState } = useProgrammeState();

  const { resourceIsGeorestricted, resourceRequiresLogin } =
    getCopyrightRestrictionForSubject({
      subjectSlug: coreProgrammeState?.subjectSlug,
      geoRestricted,
      loginRequired,
    });

  const metadata = clerkMetadataSchema.safeParse(user?.publicMetadata)?.data;
  const authState: AuthState = getAuthState({ isSignedIn, metadata });

  return getComplexCopyrightState({
    authState,
    resourceIsGeorestricted,
    resourceRequiresLogin,
    isLoaded,
  });
}
