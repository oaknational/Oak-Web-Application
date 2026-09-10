export const getIsLessonExpiring = ({
  expirationDate,
  displayExpiringBanner,
}: {
  expirationDate: string | null;
  displayExpiringBanner: boolean | undefined;
}) => expirationDate !== null || displayExpiringBanner === true;
