import { ProgrammeFields } from "@oaknational/oak-curriculum-schema";

export const getCopyrightRestrictionForSubject = ({
  subjectSlug,
  geoRestricted,
  loginRequired,
}: {
  subjectSlug?: ProgrammeFields["subject_slug"];
  geoRestricted: boolean;
  loginRequired: boolean;
}) => {
  const isRestrictedSubject = subjectSlug === "music";
  const resourceIsGeorestricted = geoRestricted || isRestrictedSubject;
  const resourceRequiresLogin = loginRequired || isRestrictedSubject;

  return { resourceIsGeorestricted, resourceRequiresLogin };
};
