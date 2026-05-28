export const getSubjectPhaseSlug = ({
  subject,
  phaseSlug,
  examBoardSlug,
  pathwaySlug,
}: {
  subject: string;
  phaseSlug: string;
  examBoardSlug?: string | null;
  pathwaySlug?: string | null;
}) => {
  const parts = [examBoardSlug, pathwaySlug].filter(Boolean);
  return [subject, phaseSlug, ...parts].join("-");
};
