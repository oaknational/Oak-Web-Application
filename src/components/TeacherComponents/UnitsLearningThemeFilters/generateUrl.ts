export const generateUrl = (
  theme: { slug: string },
  programmeSlug: string,
  yearGroupSlug?: string,
  categorySlug?: string | null,
): string => {
  const currentUrl = new URL(
    globalThis.history.state?.url ?? globalThis.location.href,
    globalThis.location.origin,
  );
  const params = new URLSearchParams(currentUrl.search);

  const newBaseUrl = `${globalThis.location.origin}/teachers/programmes/${programmeSlug}/units`;
  let newUrl = window.history.state.url;
  const buildUrlWithParams = () => {
    const query = params.toString();
    return query ? `${newBaseUrl}?${query}` : newBaseUrl;
  };

  if ((yearGroupSlug || categorySlug) && theme.slug !== "all") {
    params.delete("programmeSlug");
    params.delete("learning-theme");
    params.set("learning-theme", theme.slug);
    newUrl = buildUrlWithParams();
  } else if ((yearGroupSlug || categorySlug) && theme.slug === "all") {
    params.delete("programmeSlug");
    params.delete("learning-theme");
    newUrl = buildUrlWithParams();
  } else if (!yearGroupSlug && !categorySlug && theme.slug !== "all") {
    newUrl = `${newBaseUrl}?learning-theme=${theme.slug}`;
  } else if (!yearGroupSlug && !categorySlug && theme.slug === "all") {
    newUrl = `${window.location.origin}/teachers/programmes/${programmeSlug}/units`;
  }

  return newUrl;
};
