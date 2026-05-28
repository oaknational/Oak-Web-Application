export const getSubjectPhaseSlug = ({
  subject,
  phaseSlug,
  examBoardSlug,
}: {
  subject: string;
  phaseSlug: string;
  examBoardSlug?: string | null;
}) => {
  return `${subject}-${phaseSlug}${examBoardSlug ? `-${examBoardSlug}` : ""}`;
};
