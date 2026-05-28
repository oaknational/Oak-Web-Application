export const getSubjectPhaseFromProgrammeSlug = (programmeSlug: string) => {
  return programmeSlug.replace(/-ks\d+(?=-|$)/, "");
};
