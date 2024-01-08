export const convertUnitSlugToTitle = (unitSlug: string) => {
  const lastHyphenIndex = unitSlug.lastIndexOf("-");
  const truncatedSlug =
    lastHyphenIndex !== -1 ? unitSlug.substring(0, lastHyphenIndex) : unitSlug;
  const words = truncatedSlug.split("-");
  const capitalisedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );
  const title = capitalisedWords.join(" ").trim();
  return title;
};
