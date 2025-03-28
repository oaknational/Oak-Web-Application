"use client";

export const generateUrl = (
  theme: { slug: string },
  programmeSlug: string,
  yearGroupSlug?: string,
  categorySlug?: string | null,
): string => {
  // Base URL should be just the path in SSR
  const basePath = `/teachers/programmes/${programmeSlug}/units`;

  // Get current URL params if in browser
  const currentParams =
    typeof window !== "undefined" && window.location.search
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  // Preserve the original business logic
  if ((yearGroupSlug || categorySlug) && theme.slug !== "all") {
    currentParams.delete("programmeSlug");
    currentParams.delete("learning-theme");
    return `${basePath}?${currentParams.toString()}&learning-theme=${theme.slug}`;
  } else if ((yearGroupSlug || categorySlug) && theme.slug === "all") {
    currentParams.delete("programmeSlug");
    currentParams.delete("learning-theme");
    return `${basePath}?${currentParams.toString()}`;
  } else if (!yearGroupSlug && !categorySlug && theme.slug !== "all") {
    return `${basePath}?learning-theme=${theme.slug}`;
  } else {
    return basePath;
  }
};
