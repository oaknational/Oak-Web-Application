// Unit downloads are stored against the unit title rather than the unit slug
// unit slugs often don't match the final title displayed on the website so this keeps the file names consistent
// with what the user sees on the website
export const getUnitDownloadFileId = (
  unitTitle: string,
  unitvariantId: number,
) => `${getSlugifiedTitle(unitTitle)}-${unitvariantId}`;

const getSlugifiedTitle = (title: string) => {
  return title
    .replaceAll(/\s+/g, "-")
    .replaceAll(/[^\dA-Za-z-]/g, "")
    .replaceAll(/-+/g, "-")
    .toLowerCase();
};
