export const getAdditionalFileAssetIds = <
  T extends { assetId: string | number } | null | undefined,
>(
  additionalFiles: T[] | null | undefined,
) => {
  if (!additionalFiles) return [];

  return (
    additionalFiles
      .map((file) => file?.assetId)
      // Filter out nullish values
      .filter(
        (assetId): assetId is NonNullable<T>["assetId"] =>
          assetId !== undefined,
      )
      // Convert to numbers
      .reduce<number[]>((ids, assetId) => {
        const parsedAssetId = Number(assetId);
        if (!Number.isNaN(parsedAssetId)) {
          ids.push(parsedAssetId);
        }
        return ids;
      }, [])
  );
};
