export const getAdditionalFileAssetIds = <
  T extends { assetId: string | number } | null | undefined,
>(
  additionalFiles: T[] | null | undefined,
) => {
  if (!additionalFiles) return [];

  return additionalFiles
    .map((file) => file?.assetId)
    .filter(
      (assetId): assetId is NonNullable<T>["assetId"] => assetId !== undefined,
    );
};
