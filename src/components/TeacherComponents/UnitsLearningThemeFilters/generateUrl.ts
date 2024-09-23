export const generateUrl = (
  theme: { slug: string },
  programmeSlug: string,
  yearGroupSlug?: string,
  categorySlug?: string | null,
): string => {
  const url = new URL(window.history.state.url, window.location.origin);
  const params = new URLSearchParams(url.search);

  const newBaseUrl = `${window.location.origin}/teachers/programmes/${programmeSlug}/units`;
  let newUrl = window.history.state.url;

  if ((yearGroupSlug || categorySlug) && theme.slug !== "all") {
    params.delete("programmeSlug");
    params.delete("learning-theme");
    newUrl = `${newBaseUrl}?${params.toString()}&learning-theme=${theme.slug}`;
  } else if ((yearGroupSlug || categorySlug) && theme.slug === "all") {
    params.delete("programmeSlug");
    params.delete("learning-theme");
    newUrl = `${newBaseUrl}?${params.toString()}`;
  } else if (!yearGroupSlug && !categorySlug && theme.slug !== "all") {
    newUrl = `${newBaseUrl}?learning-theme=${theme.slug}`;
  } else if (!yearGroupSlug && !categorySlug && theme.slug === "all") {
    newUrl = `${window.location.origin}/teachers/programmes/${programmeSlug}/units`;
  }

  return newUrl;
};
