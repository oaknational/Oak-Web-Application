export const getUnitListingHref = ({
  subjectSlug,
  phaseSlug,
  yearSlug,
}: {
  subjectSlug: string;
  phaseSlug: string;
  yearSlug: string;
}) => {
  const baseSlug = `${subjectSlug}-${phaseSlug}-${yearSlug}`;
  return `/pupils/programmes/${baseSlug}/options`;
};
