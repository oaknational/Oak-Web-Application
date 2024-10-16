export const parseSubjectPhaseSlug = (slug: string) => {
  const parts = slug.split("-");
  const lastSlug = parts.pop() ?? null;
  let phaseSlug: string | null, ks4OptionSlug: string | null;
  // Use phase to determine if examboard is present
  if (lastSlug && ["primary", "secondary"].includes(lastSlug)) {
    ks4OptionSlug = null;
    phaseSlug = lastSlug;
  } else {
    ks4OptionSlug = lastSlug;
    phaseSlug = parts.pop() ?? null;
  }
  const subjectSlug = parts.join("-");
  if (!subjectSlug || !phaseSlug) {
    return;
  }
  return {
    phaseSlug: phaseSlug,
    subjectSlug: subjectSlug,
    ks4OptionSlug: ks4OptionSlug,
  };
};
