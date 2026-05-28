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
  return `${subject}-${phaseSlug}${examBoardSlug ? `-${examBoardSlug}` : ""}${
    pathwaySlug ? `-${pathwaySlug}` : ""
  }`;
};
