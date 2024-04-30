export const getBaseSlugByYearFromProgrammeSlug = (
  programmeSlug: string,
): string => {
  const r = /(.*?year-(\d+)).*/;
  const res = r.exec(programmeSlug);
  if (!res?.[1]) {
    throw new Error(
      `Could not extract baseSlug from programmeSlug: ${programmeSlug}`,
    );
  }
  return res[1];
};
