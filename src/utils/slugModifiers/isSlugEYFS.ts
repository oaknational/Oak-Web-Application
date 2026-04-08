/**
 * Matches EYFS programme slugs (e.g. maths-foundation-early-years-foundation-stage-l)
 * and captures the subject slug in group 1 / named group "subject".
 */
export const EYFS_PROGRAMME_SLUG_REGEX =
  /^(?<subject>.+)-foundation-early-years-foundation-stage-l$/;

const isSlugEYFS = (slug: string) => {
  return EYFS_PROGRAMME_SLUG_REGEX.test(slug);
};

export default isSlugEYFS;
