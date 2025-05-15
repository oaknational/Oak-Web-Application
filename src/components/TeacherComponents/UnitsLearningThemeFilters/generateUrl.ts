export const generateUrl = (
  theme: { slug: string },
  programmeSlug: string,
  yearGroupSlug?: string,
  categorySlug?: string | null,
): string => {
  const params =
    typeof window !== "undefined" && window.location.search
      ? new URLSearchParams(
          new URL(window.history.state.url, window.location.origin).search,
        )
      : new URLSearchParams();

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
